import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./db.js";
import { models } from "../lib/db.js";

const {
     Party,
  Position,
  Candidate,
  Vote
} = models;

const parties = [
  { name: "SFI", color: "#C62828" },
  { name: "KSU", color: "#1769AA" },
  { name: "Fraternity", color: "#7B3FB2" }
];

const election = [
  {
    name: "Chairperson",
    candidates: [
      ["Ephrem Mathews", "KSU"],
      ["Nandana P", "SFI"],
      ["Ramadan Anes V", "Fraternity"]
    ]
  },
  {
    name: "Vice Chairperson",
    candidates: [
      ["Sheba Fathima", "KSU"],
      ["Arya R", "SFI"]
    ]
  },
  {
    name: "General Secretary",
    candidates: [
      ["Muhammed Yamin Beck", "KSU"],
      ["Sandeep Santhosh", "SFI"],
      ["Inayath Illyas", "Fraternity"]
    ]
  },
  {
    name: "Arts Club Secretary",
    candidates: [
      ["Guatham KJ", "KSU"],
      ["Rahul R", "SFI"],
      ["Hanan Ayyoobi K P", "Fraternity"]
    ]
  },
  {
    name: "Lady Representative",
    candidates: [
      ["Ashitha A", "KSU"],
      ["Pallavi Jayachandran", "KSU"],
      ["Adithya E K", "SFI"],
      ["Keerthana Jagan", "SFI"],
      ["Amna Anan M M", "Fraternity"]
    ]
  },
  {
    name: "Magazine Editor",
    candidates: [
      ["Mariam Jo Palakkadan", "KSU"],
      ["Abja Sasikumar", "SFI"]
    ]
  },
  {
    name: "University Union Councillor 1",
    candidates: [
      ["Aravind V G", "SFI"],
        ["Hasil Ali P T", "KSU"],
      ["Naseeh Ameen", "Fraternity"]
    ]
  },
  {
    name: "University Union Councillor 2",
    candidates: [
      
        ["Sisira Thomas", "SFI"],
        ["Blesson Mathew", "KSU"],
        
    ]
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const partyMap = {};

    // Create parties
    for (const partyData of parties) {
      const [party] = await Party.findOrCreate({
        where: { name: partyData.name },
        defaults: partyData
      });

      partyMap[party.name] = party;
    }

    // Create positions and candidates
    for (const [index, post] of election.entries()) {
      const [position] = await Position.findOrCreate({
        where: { name: post.name },
        defaults: {
          name: post.name,
          sortOrder: index + 1
        }
      });

      for (const [name, partyName] of post.candidates) {
        await Candidate.findOrCreate({
          where: {
            name,
            PartyId: partyMap[partyName].id,
            PositionId: position.id
          },
          defaults: {
            name,
            PartyId: partyMap[partyName].id,
            PositionId: position.id,
            isActive: true
          }
        });
      }
    }

    console.log("Parties, positions and candidates seeded successfully!");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();
