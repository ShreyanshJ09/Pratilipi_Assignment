const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim : true,
        maxLenght: 50
    },
    email: {
        type: String,
        required: true,
        trim : true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    cart: {
        type: [String],
        default: []
    },
    previous_orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    preferences: {
      language: {
        type: [String],
        default: []
      },
      genre: {
        type: [String],
        default: []
      }
    },
    browsingHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
}, {
    timestamps: true,
    collection: 'users'
});



userSchema.statics.register = async function (name, email, password) {
    try {
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email');
        }
        

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new this({ name, email, password: hashedPassword });
        const new_user = await user.save();
        return new_user;
    } catch (error) {
        throw new Error('Error Registering user:' + error.message);
    }
}

userSchema.statics.getUser = async function (email) {
    try {
        const user = await this.findOne({email});
        return user;
    } catch (error) {
        throw new Error('Error getting user:'+error.message);
    }
}


userSchema.statics.login = async function (email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }
        return user;
    } catch (error) {
        throw new Error('Error Logging in:' + error.message);
    }
}
userSchema.statics.updateUserPreferences = async function (email, newPreferences) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        const { language, genre } = newPreferences;

        if (language && Array.isArray(language)) {
            user.preferences.language = Array.from(new Set([...user.preferences.language, ...language]));
        }
        if (genre && Array.isArray(genre)) {
            user.preferences.genre = Array.from(new Set([...user.preferences.genre, ...genre]));
        }

        await user.save();
        return user.preferences;
    } catch (error) {
        throw new Error('Error updating preferences: ' + error.message);
    }
};


userSchema.statics.updatePreviousOrders = async function (email, bookId) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (!bookId) {
            throw new Error('Invalid book ID');
        }

        // Avoid duplicates in previous orders
        if (!user.previous_orders.includes(bookId)) {
            user.previous_orders.push(bookId);
        }

        await user.save();
        return user.previous_orders;
    } catch (error) {
        throw new Error('Error updating previous orders: ' + error.message);
    }
};


userSchema.statics.updateBrowsingHistory = async function (email, bookId) {
    try {
        const user = await this.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }

        if (!bookId) {
            throw new Error('Invalid book ID');
        }

        if (!user.browsingHistory.includes(bookId)) {
            user.browsingHistory.push(bookId);
        }

        await user.save();
        return user.browsingHistory;
    } catch (error) {
        throw new Error('Error updating browsing history: ' + error.message);
    }
};



const User = mongoose.model('User', userSchema);

module.exports = User;