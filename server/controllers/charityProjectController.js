
const CharityProject = require('../model/CharityProject');
const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');

// Controller for creating a new charity project (Admin only)
exports.createCharityProject = asyncHandler(async (req, res, next) => {
    // Check if user is admin
    if (!req.user.isAdmin) {
        return next(new AppError('You are not authorized to create a charity project', 403));
    }

    // Extract project details from request body
    const { title, description, progress } = req.body;

    // Check if all required fields are provided
    if (!title || !description || progress === undefined) {
        return next(new AppError('Please provide title, description, and progress', 400));
    }

    // Create and save the new charity project
    const charityProject = await CharityProject.create({ title, description, progress });

    res.status(201).json({
        status: 'success',
        data: charityProject
    });
});

// Controller for getting all charity projects
exports.getCharityProjects = asyncHandler(async (req, res, next) => {
    const charityProjects = await CharityProject.find();

    res.status(200).json({
        status: 'success',
        results: charityProjects.length,
        data: charityProjects
    });
});
// Controller for getting all charity projects with filtering by enabled status
exports.getCharityEnabledProjects = asyncHandler(async (req, res, next) => {
    const charityProjects = await CharityProject.find({ disabled: { $ne: true } });

    res.status(200).json({
        status: 'success',
        results: charityProjects.length,
        data: charityProjects
    });
});

// Controller to disable or enable a charity project (PATCH)
exports.toggleCharityProjectStatus = asyncHandler(async (req, res, next) => {
    // Check if user is admin
    if (!req.user.isAdmin) {
        return next(new AppError('You are not authorized to modify the status of charity projects', 403));
    }

    const { projectId } = req.params;

    // Find the charity project by ID
    const project = await CharityProject.findById(projectId);

    if (!project) {
        return next(new AppError('Project not found', 404));
    }

    // Toggle the disabled status
    project.disabled = !project.disabled;
    await project.save();

    res.status(200).json({
        status: 'success',
        message: `Project has been ${project.disabled ? 'disabled' : 'enabled'}.`,
        data: project
    });
});

// Controller to update a charity project's title (PATCH or PUT)
exports.updateCharityProjectTitle = asyncHandler(async (req, res, next) => {
    // Check if user is admin
    if (!req.user.isAdmin) {
        return next(new AppError('You are not authorized to update charity projects', 403));
    }

    const { projectId } = req.params;
    const { title } = req.body;

    // Check if title is provided
    if (!title) {
        return next(new AppError('Please provide a new title for the project', 400));
    }

    // Find and update the charity project by ID
    const project = await CharityProject.findByIdAndUpdate(
        projectId,
        { title },
        { new: true, runValidators: true } // Return the updated document
    );

    if (!project) {
        return next(new AppError('Project not found', 404));
    }

    res.status(200).json({
        status: 'success',
        message: 'Project title updated successfully',
        data: project
    });
});
