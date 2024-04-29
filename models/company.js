//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");
const companySchema = new mongoose.Schema(
	{
		date: {
			type: Date,
			required: true,
		},
		name: {
			type: String,
			trim: true,
			required: true,
		},
		results: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Result",
			},
		],
		interviews: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Interview",
			},
		],
	},
	{
		timestamps: true,
	}
);
const Company = mongoose.model("Company", companySchema);
module.exports = Company;
