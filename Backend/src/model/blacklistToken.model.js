const mongoose = require('mongoose')

const blacklistTokenSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,'token is required to add in blacklist']
    }
},{
    timeseries:true
})

blacklistTokenSchema.index({cveatedAt:1},
    {expireAfterSeconds:60*60*23*3}
)

const blacklistTokenModel  = mongoose.model("blacklistToken", blacklistTokenSchema)

module.exports = blacklistTokenModel