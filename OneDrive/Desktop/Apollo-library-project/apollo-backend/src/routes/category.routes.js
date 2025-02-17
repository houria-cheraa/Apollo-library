"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const router = (0, express_1.Router)();
router.route("/").get(category_controller_1.getAllCategories);
router.route("/:id").get(category_controller_1.getCategory);
router.route("/create").post(category_controller_1.createCategory);
router.route("/update/:id").put(category_controller_1.updateCategory);
router.route("/delete/:id").delete(category_controller_1.deleteCategory);
exports.default = router;
