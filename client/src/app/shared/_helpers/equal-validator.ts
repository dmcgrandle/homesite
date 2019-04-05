import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, FormGroup, ValidatorFn } from '@angular/forms';

// Set up the directive for a custom form validation - "password" and "retype" password.
// Using template driven forms, so need a custom @Directive to create a selector for use
// in the form.  Note: this selector is applied as an attribute in the form GROUP
// (note the ngModelGroup="passGroup" in the template).  That way all the formGroup input
// fields will be sent in the FormControl object injected into the function within the
// factory - yeah, the syntax is a bit confusing for this...
@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[equal]',
    providers: [{ provide: NG_VALIDATORS, useExisting: EqualDirective, multi: true }]
})
// This class has one property, a constructor that sets that property, and the required
// validate() function (required by the Validator interface).
export class EqualDirective implements Validator {
    validator: ValidatorFn;
    constructor() {
        this.validator = validateEqualFactory();
    }
    validate(c: FormGroup) {
        return this.validator(c);
    }
}

// This factory function simply returns a function.  The inner function is the one that
// has the FormGroup object injected into it - note it is a FormGroup object because we
// need both the password AND the retry passed to us (these are the only two elements in
// the ngModelGroup="passGroup") in order to compare them.  This can be used generically
// though, so I map password -> "first" and retry -> "second".
function validateEqualFactory(): ValidatorFn {
    return (c: FormGroup) => {
        const [first, second] = Object.keys(c.value || {}); // Deconstruct array syntax
        return c.value[first] === c.value[second] ? null : { equal: { valid: false } };
    };
}
