// Define a schema for the registration data
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phonenumber:{
    type: String,
    require: true
  },
  occupation:{
    type: String,
    require: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  
}, {
    collection: "Logins"
});

// Create a model based on the schema
mongoose.model('Logins', userSchema);