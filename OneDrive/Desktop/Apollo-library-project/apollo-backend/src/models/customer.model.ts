import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const customerSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        firstName: {
            type: String,
            required: [true, "First Name is required"],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, "Last Name is required"],
            trim: true,
        },
        wishlist: [
            {
                type: [Schema.Types.ObjectId],
                ref: "Book",
            },
        ],
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        confirmationCode: {
            type: String,
        },
    },
    { timestamps: true }
);

customerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

customerSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

customerSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY as number | undefined }
    );
};

customerSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY as
                | number
                | undefined,
        }
    );
};

export const Customer = mongoose.model("Customer", customerSchema);
