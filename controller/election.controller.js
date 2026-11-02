
import { Op } from "sequelize";
import { models } from "../lib/db.js";
import { sequelize } from "../lib/db.js";
import { createHmac } from "node:crypto";
const { 
  Party,
  Position,
  Candidate,
  Vote,
VotedIP} = models;

// GET /api/election/ballot
// Public ballot: no vote counts returned
export const getBallot = async (req, res) => {
  try {
    const positions = await Position.findAll({
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      include: [
        {
          model: Candidate,
          where: { isActive: true },
          required: false,
          attributes: ["id", "name"],
          include: [{
            model: Party,
            attributes: ["id", "name", "color"]
          }]
        }
      ]
    });

    res.json({ positions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ballot" });
  }
};

// POST /api/election/parties
export const addParty = async (req, res) => {
  try {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        message: "Party name and color are required"
      });
    }

    const party = await Party.create({ name, color });
    res.status(201).json({ message: "Party created", party });
  } catch (error) {
    res.status(error.name === "SequelizeUniqueConstraintError" ? 409 : 500)
      .json({ message: error.name === "SequelizeUniqueConstraintError"
        ? "Party already exists"
        : "Failed to create party" });
  }
};

// POST /api/election/positions
export const addPosition = async (req, res) => {
  try {
    const { name, sortOrder = 0 } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Position name is required"
      });
    }

    const position = await Position.create({ name, sortOrder });
    res.status(201).json({ message: "Position created", position });
  } catch (error) {
    res.status(error.name === "SequelizeUniqueConstraintError" ? 409 : 500)
      .json({ message: "Failed to create position" });
  }
};

// POST /api/election/candidates
export const addCandidate = async (req, res) => {
  try {
    const { name, partyId, positionId } = req.body;

    if (!name || !Number.isInteger(Number(partyId)) ||
        !Number.isInteger(Number(positionId))) {
      return res.status(400).json({
        message: "Name, partyId and positionId are required"
      });
    }

    const [party, position] = await Promise.all([
      Party.findByPk(partyId),
      Position.findByPk(positionId)
    ]);

    if (!party || !position) {
      return res.status(404).json({
        message: "Party or position not found"
      });
    }

    const candidate = await Candidate.create({
      name,
      PartyId: party.id,
      PositionId: position.id
    });

    res.status(201).json({
      message: "Candidate created",
      candidate
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create candidate" });
  }
};


export const submitVote = async (req, res) => {
  const { selections } = req.body ?? {};

  // Validate ballot
  if (!Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({
      message: "Selections must be a non-empty array"
    });
  }

  const normalized = selections.map((s) => ({
    positionId: Number(s.positionId),
    candidateId: Number(s.candidateId)
  }));

  if (normalized.some(s =>
    !Number.isInteger(s.positionId) ||
    !Number.isInteger(s.candidateId)
  )) {
    return res.status(400).json({
      message: "Invalid positionId or candidateId"
    });
  }

  if (
    new Set(normalized.map(s => s.positionId)).size !== normalized.length
  ) {
    return res.status(400).json({
      message: "Only one candidate per position is allowed"
    });
  }

  // Require configured IP hashing
  const ipHashSecret = process.env.IP_HASH_SECRET;

  if (!ipHashSecret) {
    console.error("IP_HASH_SECRET is not configured");

    return res.status(500).json({
      message: "IP restriction is not configured"
    });
  }

  if (!VotedIP) {
    console.error("VotedIP model is not registered");

    return res.status(500).json({
      message: "IP restriction is not configured"
    });
  }

  // Express req.ip depends on your proxy configuration.
  const clientIP = req.ip;

  if (!clientIP) {
    return res.status(400).json({
      message: "Unable to identify client IP"
    });
  }

  // Hash IP instead of storing the raw address.
  const ipHash = createHmac("sha256", ipHashSecret)
    .update(clientIP)
    .digest("hex");

  const transaction = await sequelize.transaction();

  try {
    // Validate all positions exist.
    const positions = await Position.findAll({ transaction });

    if (
      positions.length !== normalized.length ||
      positions.some(p =>
        !normalized.some(s => s.positionId === p.id)
      )
    ) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Select exactly one candidate for every position"
      });
    }

    // Validate candidates.
    const candidates = await Candidate.findAll({
      where: {
        id: { [Op.in]: normalized.map(s => s.candidateId) },
        isActive: true
      },
      transaction
    });

    if (candidates.length !== normalized.length) {
      await transaction.rollback();

      return res.status(400).json({
        message: "One or more candidates are invalid or inactive"
      });
    }

    for (const selection of normalized) {
      const candidate = candidates.find(
        c => c.id === selection.candidateId
      );

      if (!candidate || candidate.PositionId !== selection.positionId) {
        await transaction.rollback();

        return res.status(400).json({
          message: "Candidate does not belong to the selected position"
        });
      }
    }

    // Register this IP. VotedIP.ipHash MUST have a UNIQUE constraint.
    // Concurrent duplicate submissions are rejected by the database.
    await VotedIP.create(
      { ipHash },
      { transaction }
    );

    // Save all votes in the same transaction.
    const votes = normalized.map(selection => ({
      CandidateId: selection.candidateId,
      PositionId: selection.positionId
    }));

    await Vote.bulkCreate(votes, { transaction });

    await transaction.commit();

    return res.status(201).json({
      message: "Vote submitted successfully"
    });

  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    // Same IP has already registered a ballot.
    if (error instanceof UniqueConstraintError) {
      return res.status(409).json({
        message: "A ballot has already been submitted from this IP address."
      });
    }

    console.error("Vote submission failed:", error);

    return res.status(500).json({
      message: "Failed to submit vote"
    });
  }
};


// GET /api/election/admin/results
// Protect this endpoint with admin authentication.
export const getResults = async (req, res) => {
  try {
    const positions = await Position.findAll({
      order: [["sortOrder", "ASC"], ["id", "ASC"]],
      include: [{
        model: Candidate,
        attributes: ["id", "name"],
        include: [
          { model: Party, attributes: ["id", "name", "color"] },
          { model: Vote, attributes: ["id"], required: false }
        ]
      }]
    });

    const results = positions.map(position => ({
      position: position.name,
      candidates: position.Candidates.map(candidate => ({
        candidateId: candidate.id,
        name: candidate.name,
        party: candidate.Party.name,
        color: candidate.Party.color,
        votes: candidate.Votes.length
      }))
    }));

    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};
