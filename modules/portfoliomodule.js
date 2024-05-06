const mongoose=require('mongoose');

const introSchema=new mongoose.Schema({
    welcomeText : {
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});

const aboutSchema=new mongoose.Schema({
 lottieUrl:{
    type:String,
    required:true
},
description1:{
    type:String,
    required:true
},
description2:{
    type:String,
    required:true 
},
skills:{
    type:Array,
    required:true
}
});


const experienceSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    period:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
});


const projectSchema=new mongoose.Schema({
title:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
image:{
    type:String,
    required:true
},
link:{
    type:String,
    required:true
},
technologies:{
    type:Array,
    required:true
}
});

const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required:true
    }
})


const contactSchema = new mongoose.Schema({
name:{
    type:String,
    required:true
},
gender:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
mobile:{
    type:String,
    required:true
},
age:{
    type:String,
    required:true
},
address:{
    type:String,
    required:true
}
})


module.exports={
Intro:mongoose.model("intros",introSchema),
About:mongoose.model("Abouts",aboutSchema),
Experience:mongoose.model("experiences",experienceSchema),
Project:mongoose.model("projects",projectSchema),
Course:mongoose.model("courses",courseSchema),
Contact:mongoose.model("contacts",contactSchema)
}