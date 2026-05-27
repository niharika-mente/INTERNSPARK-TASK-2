import { Router } from "express";
import { Task } from "../mongoose/schemas/task.mjs";
import { checkSchema, validationResult } from "express-validator";
import { createValidationSchema } from "../utils/validationSchema.mjs";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    return res.status(200).send(tasks);
  } catch (err) {
    console.log(err);

    return res.sendStatus(500);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const foundTask = await Task.findById(req.params.id);

    if (!foundTask) {
      return res.sendStatus(404);
    }

    return res.status(200).send(foundTask);
  } catch (err) {
    console.log(err);

    return res.sendStatus(500);
  }
});

router.post(
  "/",
  checkSchema(createValidationSchema),
  async (req, res) => {
   

    try {
      const newTask = new Task(req.body);

      const savedTask = await newTask.save();

      return res.status(201).send(savedTask);
    } catch (err) {
      console.log(err);

      return res.sendStatus(400);
    }
  }
);

router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
  returnDocument: "after",
  runValidators: true,
}
    );

    if (!updatedTask) {
      return res.sendStatus(404);
    }

    return res.status(200).send(updatedTask);
  } catch (err) {
    console.log(err);

    return res.sendStatus(400);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
        {
  returnDocument: "after",
  runValidators: true,
}
    );

    if (!updatedTask) {
      return res.sendStatus(404);
    }

    return res.status(200).send(updatedTask);
  } catch (err) {
    console.log(err);

    return res.sendStatus(400);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTask) {
      return res.sendStatus(404);
    }

    return res.status(200).send({
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.sendStatus(500);
  }
});

export default router;