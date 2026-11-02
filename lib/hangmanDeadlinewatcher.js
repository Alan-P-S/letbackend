import { models, sequelize } from "../lib/db.js";
const { 
 HangmanTask, HangmanGameSlot } = models;

export function startHangmanDeadlineWatcher() {
  let running = false;

  const timer = setInterval(async () => {
    if (running) return;
    running = true;

    try {
      await sequelize.transaction(async transaction => {
        const slot = await HangmanGameSlot.findByPk(1, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        if (!slot?.currentTaskId) return;

        const task = await HangmanTask.findByPk(slot.currentTaskId, {
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        if (
          task &&
          task.status === "active" &&
          Date.now() >= new Date(task.deadline).getTime()
        ) {
          task.status = "failed";
          task.failedAt = new Date();
          await task.save({ transaction });

          console.log(`Hangman task ${task.id} failed: deadline passed.`);
        }
      });
    } catch (error) {
      console.error("Hangman deadline watcher error:", error.message);
    } finally {
      running = false;
    }
  }, 1000);

  timer.unref?.();
  return () => clearInterval(timer);
}
