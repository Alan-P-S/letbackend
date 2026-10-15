
import { Router } from "express";

import {
  getBallot,
  addParty,
  addPosition,
  addCandidate,
  submitVote,
  getResults
} from "../controller/election.controller.js"

import { adminOnly } from "../lib/adminOnly.js";

const router = Router();

// Public endpoints
router.get("/ballot", getBallot);
router.post("/votes", submitVote);

// Admin endpoints
router.post("/parties", adminOnly, addParty);
router.post("/positions", adminOnly, addPosition);
router.post("/candidates", adminOnly, addCandidate);
router.get("/admin/results", adminOnly, getResults);

export default router;
