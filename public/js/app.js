var notyf = new Notyf();
let message = msg || 'Uh oh! Some Error Occurred. Please try again later'
console.log(message)
if (error){
    notyf.error(message)
}