import mongoose from 'mongoose';

const SchedulerLogSchema = new mongoose.Schema({
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  },
  ordersProcessed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILED'],
    required: true
  },
  error: {
    type: String
  }
});

const SchedulerLog = mongoose.model('SchedulerLog', SchedulerLogSchema);

export default SchedulerLog;
