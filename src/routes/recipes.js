import express from "express";
import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/User.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    await recipe.save({});
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

router.put("/", verifyToken, async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);
    if (!user.savedRecipes.includes(recipe._id)) {
      user.savedRecipes.push(recipe._id);
      await user.save();
    }
    console.log("Saved recipes:", user.savedRecipes);
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error("Error saving recipe:", err);
    res.status(500).json({ message: "Error saving recipe" });
  }
});

// router.get("/savedRecipes/ids/:userID", async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.params.userId);
//     res.json({ savedRecipes: user?.savedRecipes });
//   } catch (err) {
//     res.json(err);
//   }
// });

// router.get("/savedRecipes/ids/:userID", async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.params.userID);
//     console.log("Saved recipes for user:", user?.savedRecipes);
//     res.json({ savedRecipes: user?.savedRecipes });
//   } catch (err) {
//     console.error("Error fetching saved recipes:", err);
//     res.status(500).json({ message: "Error fetching saved recipes" });
//   }
// });

router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID).populate({
      path: "savedRecipes",
      model: "Recipe",
    });
    console.log("Saved recipes for user:", user?.savedRecipes);
    if (user) {
      res.json({ savedRecipes: user.savedRecipes });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching saved recipes:", err);
    res.status(500).json({ message: "Error fetching saved recipes" });
  }
});

router.get("/savedRecipes/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

export { router as recipesRouter };
