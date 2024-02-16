import { AbstractControl } from '@angular/forms';
export class customValidation {  

    static isEmailValid(control: AbstractControl): any {
        

        if (control.get('email').value != null) {

            let myvalue = control.get('email').value.toString();

            if (myvalue.indexOf('@') == -1) {
                control.get('email').setErrors({ EmailInvalid: true })

            } else if (myvalue.includes('..')) {
                control.get('email').setErrors({ EmailInvalid: true })
            } else if (myvalue.indexOf(' ') != -1) {
                control.get('email').setErrors({ EmailInvalid: true })
            }
            else {
                //console.log("@ present");
                let a = myvalue.split('@');
                // console.log('length', a.length);
                // console.log('length name', a);
                if (a.length > 2) {
                    control.get('email').setErrors({ EmailInvalid: true })
                } else {
                    if (a.length == 2) {
                        let c = myvalue.substring(myvalue.indexOf('@'), myvalue.indexOf('.'))
                        let b = a[1];
                        // console.log('length name substring', c)
                        // console.log('length name substring length', c.length)
                        if (c.length == 1) {
                            control.get('email').setErrors({ EmailInvalid: true })
                        }


                        else if (b.indexOf('.') == -1) {
                            control.get('email').setErrors({ EmailInvalid: true })
                        } else {
                            if (b.includes('..')) {
                                control.get('email').setErrors({ EmailInvalid: true })
                            } else {
                                let c = b.split('.');
                                if (c[1].length <= 1) {
                                    control.get('email').setErrors({ EmailInvalid: true })
                                } else {
                                    if (!isNaN(c[c.length - 1])) {
                                        control.get('email').setErrors({ EmailInvalid: true })
                                    }
                                }
                            }
                        }
                    }

                }
            }
        } else {
            // console.log("null");
        }
    }


    static isEmailIdValid(control: AbstractControl): any {
       

        if (control.get('emailId').value != null) {

            let myvalue = control.get('emailId').value.toString();

            if (myvalue.indexOf('@') == -1) {
                control.get('emailId').setErrors({ EmailInvalid: true })

            } else if (myvalue.includes('..')) {
                control.get('emailId').setErrors({ EmailInvalid: true })
            } else if (myvalue.indexOf(' ') != -1) {
                control.get('emailId').setErrors({ EmailInvalid: true })
            }
            else {
                //console.log("@ present");
                let a = myvalue.split('@');
          
                if (a.length > 2) {
                    control.get('emailId').setErrors({ EmailInvalid: true })
                } else {
                    if (a.length == 2) {
                        let c = myvalue.substring(myvalue.indexOf('@'), myvalue.indexOf('.'))
                        let b = a[1];
                       
                        if (c.length == 1) {
                            control.get('emailId').setErrors({ EmailInvalid: true })
                        }


                        else if (b.indexOf('.') == -1) {
                            control.get('emailId').setErrors({ EmailInvalid: true })
                        } else {
                            if (b.includes('..')) {
                                control.get('emailId').setErrors({ EmailInvalid: true })
                            } else {
                                let c = b.split('.');
                                if (c[1].length <= 1) {
                                    control.get('emailId').setErrors({ EmailInvalid: true })
                                } else {
                                    if (!isNaN(c[c.length - 1])) {
                                        control.get('emailId').setErrors({ EmailInvalid: true })
                                    }
                                }
                            }
                        }
                    }

                }
            }
        } else {
            // console.log("null");
        }
    }


    static isBusinessEmailValid(control: AbstractControl):any{    
        

        if (control.get('BusinessEmail').value != null && control.get('BusinessEmail').value != "" ) {

            let myvalue = control.get('BusinessEmail').value.toString();

            if (myvalue.indexOf('@') == -1) {
                control.get('BusinessEmail').setErrors({ EmailInvalid: true })

            } else if (myvalue.includes('..')) {
                control.get('BusinessEmail').setErrors({ EmailInvalid: true })
            } else if (myvalue.indexOf(' ') != -1) {
                control.get('BusinessEmail').setErrors({ EmailInvalid: true })
            }
            else {
                //console.log("@ present");
                let a = myvalue.split('@');
              
                if (a.length > 2) {
                    control.get('BusinessEmail').setErrors({ EmailInvalid: true })
                } else {
                    if (a.length == 2) {
                        let c = myvalue.substring(myvalue.indexOf('@'), myvalue.indexOf('.'))
                        let b = a[1];
                      
                        if (c.length == 1) {
                            control.get('BusinessEmail').setErrors({ EmailInvalid: true })
                        }


                        else if (b.indexOf('.') == -1) {
                            control.get('BusinessEmail').setErrors({ EmailInvalid: true })
                        } else {
                            if (b.includes('..')) {
                                control.get('BusinessEmail').setErrors({ EmailInvalid: true })
                            } else {
                                let c = b.split('.');
                                if (c[1].length <= 1) {
                                    control.get('BusinessEmail').setErrors({ EmailInvalid: true })
                                } else {
                                    if (!isNaN(c[c.length - 1])) {
                                        control.get('BusinessEmail').setErrors({ EmailInvalid: true })
                                    }
                                }
                            }
                        }
                    }

                }
            }
        } else {
            // console.log("null");
        }
    }


    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('New_Password').value; // to get value in input tag
        let confirmPassword = AC.get('confirmnewpass').value; // to get value in input tag
        if (password != confirmPassword) {
            AC.get('confirmnewpass').setErrors({ notMatch: true })
        } else {
            return null
        }
    }
  
    static numOnly(value) {
        var RegExp = /^[0-9]*$/gm
        if (RegExp.test(value)) {
            return false;
        } else {
            return true;
        }
    }

}