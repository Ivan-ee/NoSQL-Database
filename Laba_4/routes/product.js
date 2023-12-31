const Product = require("../models/Product");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const Category = require("../models/category");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    const categories = req.body.categories;

    try {
        const savedProduct = await newProduct.save();

        for (const categoryName of categories) {
            let category = await Category.findOne({name: categoryName});

            if (!category) {
                category = await Category.create({
                    name: categoryName
                });
            }
        }

        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            {new: true}
        );
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Товар удалён");
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/", async (req, res) => {
    let qCategory = req.query.category || "All";
    const qSearch = req.query.search || "";
    let qSort = req.query.sort || "rating";

    const categoriesObject = await Category.find();

    const categories = categoriesObject.map(category => category.name);

    try {

        qCategory === "All"
            ? (qCategory = [...categories])
            : (qCategory = req.query.category.split(","));

        req.query.sort ? (qSort = req.query.sort.split(",")) : (qSort = [qSort]);

        let sortBy = {};
        if (qSort[1]) {
            sortBy[qSort[0]] = qSort[1];
        } else {
            sortBy[qSort[0]] = "asc";
        }

        const products = await Product.find({$text: {$search: qSearch}})
            .where("categories")
            .in([...qCategory])
            .sort(sortBy)

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;