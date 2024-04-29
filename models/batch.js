//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");
const batchSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		students: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Student",
			},
		],
		enrolments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Enrolment",
			},
		],
	},
	{
		timestamps: true,
	}
);

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;
