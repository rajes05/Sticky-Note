//function to validate email
export const validateEmail = (email)=> {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//function to get initial letter from name
export const getInitials = (name) => {
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";

    //Math.min : return min value 
    // example : name = "John Doe" => words = ["John","Doe"] 
    //           words[0][0]="J" words[1][0] ="D"
    for(let i=0; i<Math.min(words.length,2); i++){
        initials += words[i][0];
    }
    return initials.toUpperCase();
}