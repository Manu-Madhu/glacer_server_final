import { isValidObjectId } from "mongoose";
import  { createDiscount, getDiscounts, getDiscountsById, updateDiscount,
     deleteDiscount, applyCouponDiscount } from "../services/discount.service.js";

export const createDiscountCtrl = async (req, res) => {
    try {
        const discount = await createDiscount(req.body);
        if (!discount) {
            throw new Error('Failed')
        }
        res.status(201).json({ success: true, message: "Discount created", data: discount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create discount", error: error.message });
    }
};

export const getDiscountsCtrl = async (req, res) => {
    try {
        const { isActive, appliesAutomatically, code } = req.query;
        const query = {};

        if (isActive !== undefined) query.isActive = isActive === "true";
        if (appliesAutomatically !== undefined) query.appliesAutomatically = appliesAutomatically === "true";
        if (code) query.code = code;

        const discounts = await getDiscounts(query);
        res.status(200).json({ success: true, data: discounts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch discounts", error: error.message });
    }
};

export const getDiscountByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const discount = await getDiscountsById(id);
        if (!discount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }
        res.json({ success: true, data: discount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch discount", error: error.message });
    }
};

export const updateDiscountCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDiscount = await updateDiscount(id, req.body);

        if (!updatedDiscount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }
        res.json({ success: true, message: "Discount updated", data: updatedDiscount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update discount", error: error.message });
    }
};

export const deleteDiscountCtrl = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDiscount = await deleteDiscount(id);
        if (!deletedDiscount) {
            return res.status(404).json({ success: false, message: "Discount not found" });
        }
        res.json({ success: true, message: "Discount deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete discount", error: error.message });
    }
};


export const fetchAvailableCouponsCtrl = async (req, res) => {
    try {
        const { userId } = req.user;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const filters = { appliesAutomatically: false, usedBy: { $nin: [userId] }, isActive: true, endDate: { $gte: new Date() } }
        const projects = { usedBy: 0 }

        const availableCoupons = await getDiscounts(filters, projects)

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { coupons: availableCoupons },
            error: null
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const fetchCouponValue = async (req, res) => {
    try {
        const { userId } = req.user;
        const { couponCode, amount } = req.body;

        const { couponDiscountAmt, couponDiscountMsg } = await applyCouponDiscount(userId, couponCode, amount)

        return res.status(200).json({
            success: true,
            message: couponDiscountMsg ?? 'success',
            data: {
                discount: couponDiscountAmt
            },
            error: null
        })
    } catch (error) {
        console.log(error);
        res.status(error?.statusCode ?? 500).json({
            success: false,
            message: error?.message ?? "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}