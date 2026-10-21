

import { models, sequelize } from "../lib/db.js";
const { 
 HangmanTask, HangmanGameSlot } = models;

const SLOT_ID = 1;
const MAX_DURATION_MINUTES = 10080;

function taskResponse(task) {
  if (!task) return null;

  return {
    id: task.id,
    title: task.title,
    durationMinutes: task.durationMinutes,
    deadline: task.deadline,
    status: task.status,
    createdAt: task.createdAt,
    completedAt: task.completedAt,
    failedAt: task.failedAt
  };
}

async function lockGameSlot(transaction) {
  const slot = await HangmanGameSlot.findByPk(SLOT_ID, {
    transaction,
    lock: transaction.LOCK.UPDATE
  });

  if (!slot) {
    throw new Error(
      "Hangman game slot is missing. Seed hangman_game_slots with id=1."
    );
  }

  return slot;
}

async function lockCurrentTask(slot, transaction) {
  if (!slot.currentTaskId) return null;

  return HangmanTask.findByPk(slot.currentTaskId, {
    transaction,
    lock: transaction.LOCK.UPDATE
  });
}

// This function must be called while the game slot is locked.
function expireIfNeeded(task) {
  if (
    task &&
    task.status === "active" &&
    Date.now() >= new Date(task.deadline).getTime()
  ) {
    task.status = "failed";
    task.failedAt = new Date();
  }

  return task;
}

async function saveIfChanged(task, transaction) {
  if (task?.changed()) {
    await task.save({ transaction });
  }
}

// GET /api/hangman/current
export async function getCurrentTask(req, res, next) {
  try {
    const result = await sequelize.transaction(async transaction => {
      const slot = await lockGameSlot(transaction);
      const task = await lockCurrentTask(slot, transaction);

      expireIfNeeded(task);
      await saveIfChanged(task, transaction);

      return taskResponse(task);
    });

    res.json({ task: result });
  } catch (error) {
    next(error);
  }
}

// POST /api/hangman/tasks
export async function createTask(req, res, next) {
  try {
    const title =
      typeof req.body?.title === "string"
        ? req.body.title.trim()
        : "";

    const duration = Number(req.body?.durationMinutes);

    if (!title || title.length > 120) {
      return res.status(400).json({
        error: "Task title must contain between 1 and 120 characters."
      });
    }

    if (
      !Number.isInteger(duration) ||
      duration < 1 ||
      duration > MAX_DURATION_MINUTES
    ) {
      return res.status(400).json({
        error: "Duration must be an integer between 1 and 10080 minutes."
      });
    }

    const result = await sequelize.transaction(async transaction => {
      // Every task creation locks the same row.
      const slot = await lockGameSlot(transaction);
      const current = await lockCurrentTask(slot, transaction);

      expireIfNeeded(current);
      await saveIfChanged(current, transaction);

      if (current?.status === "active") {
        return {
          conflict: true,
          task: taskResponse(current)
        };
      }

      const now = Date.now();

      const task = await HangmanTask.create({
        title,
        durationMinutes: duration,
        deadline: new Date(now + duration * 60_000),
        status: "active"
      }, { transaction });

      slot.currentTaskId = task.id;
      await slot.save({ transaction });

      return {
        conflict: false,
        task: taskResponse(task)
      };
    });

    if (result.conflict) {
      return res.status(409).json({
        error: "Finish your current task before starting another.",
        task: result.task
      });
    }

    res.status(201).json({
      message: "Mission started.",
      task: result.task
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/hangman/complete
export async function completeTask(req, res, next) {
  try {
    const result = await sequelize.transaction(async transaction => {
      const slot = await lockGameSlot(transaction);
      const task = await lockCurrentTask(slot, transaction);

      if (!task) {
        return {
          status: 404,
          body: { error: "No task has been created yet.", task: null }
        };
      }

      expireIfNeeded(task);

      if (task.status === "failed") {
        await saveIfChanged(task, transaction);

        return {
          status: 409,
          body: {
            error: "Deadline passed. The man could not be saved.",
            task: taskResponse(task)
          }
        };
      }

      if (task.status === "completed") {
        return {
          status: 200,
          body: {
            message: "This task is already completed.",
            task: taskResponse(task)
          }
        };
      }

      task.status = "completed";
      task.completedAt = new Date();

      await task.save({ transaction });

      return {
        status: 200,
        body: {
          message: "Task completed! The man is saved.",
          task: taskResponse(task)
        }
      };
    });

    res.status(result.status).json(result.body);
  } catch (error) {
    next(error);
  }
}

// POST /api/hangman/check-deadline
export async function checkDeadline(req, res, next) {
  try {
    const result = await sequelize.transaction(async transaction => {
      const slot = await lockGameSlot(transaction);
      const task = await lockCurrentTask(slot, transaction);

      expireIfNeeded(task);
      await saveIfChanged(task, transaction);

      return taskResponse(task);
    });

    res.json({ task: result });
  } catch (error) {
    next(error);
  }
}


export async function getAllTasks(req, res, next) {
  try {
    const tasks = await HangmanTask.findAll({
      order: [["createdAt", "DESC"]]
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
}
