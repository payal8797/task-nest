const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Project name is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        icon: {
            type: String,
            default: '',
        },
        fav: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
