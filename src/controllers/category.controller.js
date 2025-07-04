import { isValidObjectId } from "mongoose";
import { createCategory, updateCategory, updateCategoryStatus,
     getCategoryById, getManyCategories } from "../services/category.service.js";
import { deleteFileFromDO } from "../utils/storage.util.js";

export const createCategoryCtrl = async (req, res) => {
    try {
        const createObj = req.body

        const category = await createCategory(createObj)

        if (!category) {
            throw new Error('FAILED')
        }

        return res.status(201).json({
            success: true,
            message: 'success',
            data: { category },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const updateCategoryCtrl = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const category = await getCategoryById(id)

        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Not Found',
                data: null,
                error: 'NOT_FOUND'
            })
        }

        const updateObj = req.body;

        if (category?.image?.key && (updateObj?.image?.key !== category?.image?.key)) {
            try {
                await deleteFileFromDO(category?.image?.key)
            } catch (error) {
                console.log(error)
            }
        }

        const updatedCategory = await updateCategory(id, updateObj)

        if (!updatedCategory) {
            throw new Error('FAILED')
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { category: updatedCategory },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}

export const updateCategoryStatusCtrl = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const { status } = req.body;
        if (!['archived', 'unarchived']?.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        let isArchived;
        if (status === 'archived') {
            isArchived = true;
        }
        else {
            isArchived = false;
        }

        const category = await updateCategoryStatus(id, isArchived)

        if (!category) {
            throw new Error('FAILED')
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { category },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}


export const getCategoryByIdCtrl = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Id',
                data: null,
                error: 'BAD_REQUEST'
            })
        }

        const category = await getCategoryById(id)

        if (!category) {
            throw new Error('FAILED')
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { category },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}



export const getManyCategoriesCtrl = async (req, res, next) => {
    try {
        let { page, entries } = req.query;
        page = parseInt(page);
        entries = parseInt(entries)
        const { search, parent } = req.query;

        const filters = { isArchived: false };

        if (search?.trim()) {
            filters.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ]
        }

        if(isValidObjectId(parent)){
            filters.parent = parent
        }

        let result = await getManyCategories(filters)
        console.log({ result })

        if (page && entries) {
            result = result.slice((page - 1) * entries, page * entries)
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { result },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}


export const getAllCategoriesCtrl = async (req, res, next) => {
    try {
        let { page, entries } = req.query;
        page = parseInt(page);
        entries = parseInt(entries)
        const { search , parent} = req.query;

        const filters = {};

        if (search?.trim()) {
            filters.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
            ]
        }

        if(isValidObjectId(parent)){
            filters.parent = parent
        }

        let result = await getManyCategories(filters)
        console.log({ result })

        if (page && entries) {
            result = result.slice((page - 1) * entries, page * entries)
        }

        return res.status(200).json({
            success: true,
            message: 'success',
            data: { result },
            error: null
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Internal Server error",
            data: null,
            error: 'INTERNAL_SERVER_ERROR'
        })
    }
}