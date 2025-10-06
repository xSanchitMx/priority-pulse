import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";
import Task from "../models/Task.js"; // Adjust path if needed
import User from "../models/User.js"; // If you store user emails with tasks

dotenv.config();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

//Verify transporter
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Mailer not working:", error);
//   } else {
//     console.log("Mailer ready to send emails!");
//   }
// });


cron.schedule("0 9 * * *", async () => {
  console.log("🕒 Running deadline notifier job...");

  try {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const tasks = await Task.find({
      dueDate: { $gte: now, $lte: tomorrow },
      status: { $ne: "Completed" },
    }).populate("createdBy", "email");

    for (const task of tasks) {
      const userEmail = task.createdBy?.email;
      if (!userEmail) continue;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "Task Deadline Reminder",
        text: `Hello! Your task "${task.title}" is due on ${task.dueDate.toLocaleDateString()}. Please take action before the deadline.`,
      });

      console.log(`Reminder sent to ${userEmail} for task: ${task.title}`);
    }
  } catch (err) {
    console.error("Error in deadline notifier:", err);
  }
});
