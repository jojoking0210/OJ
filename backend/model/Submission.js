const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubmissionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    solution: { type: String, required: true },
    output: { type: String, required: true },
    verdict: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
