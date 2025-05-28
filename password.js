document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('passwordInput');
    const validateBtn = document.getElementById('validateBtn');
    const resultDiv = document.getElementById('result');
    
    // Elementos de reglas
    const lengthRule = document.getElementById('lengthRule');
    const upperRule = document.getElementById('upperRule');
    const numberRule = document.getElementById('numberRule');
    const specialRule = document.getElementById('specialRule');
    
    validateBtn.addEventListener('click', function() {
        const password = passwordInput.value;
        const validationResult = validatePassword(password);
        
        // Mostrar resultado
        if (validationResult.valid) {
            resultDiv.textContent = "✅ Contraseña válida";
            resultDiv.className = "valid";
        } else {
            resultDiv.textContent = "❌ Contraseña inválida";
            resultDiv.className = "invalid";
        }
        
        // Actualizar reglas
        updateRuleDisplay(validationResult.checks);
    });
    
    // Función para validar la contraseña usando DFA
    function validatePassword(password) {
        let state = 0;
        let checks = {
            length: false,
            upper: false,
            number: false,
            special: false
        };
        
        // Verificar longitud
        checks.length = password.length >= 8;
        
        for (let char of password) {
            // Verificar mayúsculas
            if (char >= 'A' && char <= 'Z') {
                checks.upper = true;
            }
            // Verificar números
            if (char >= '0' && char <= '9') {
                checks.number = true;
            }
            // Verificar caracteres especiales
            if ("!@#$%^&*".includes(char)) {
                checks.special = true;
            }
        }
        
        // Implementación del DFA
        if (password.length === 0) {
            state = 0; // Estado inicial
        } else if (password.length < 8) {
            state = 1; // Contraseña demasiado corta
        } else {
            state = 2; // Longitud válida
            
            if (checks.upper) {
                state = 3; // Tiene mayúscula
            }
            if (checks.number) {
                state = state >= 3 ? 4 : 4; // Tiene número
            }
            if (checks.special) {
                state = state >= 3 ? 5 : 5; // Tiene carácter especial
            }
            
            // Si cumple todas las reglas
            if (checks.upper && checks.number && checks.special) {
                state = 6; // Estado de aceptación
            }
        }
        
        return {
            valid: state === 6,
            checks: checks,
            finalState: state
        };
    }
    
    // Función para actualizar la visualización de las reglas
    function updateRuleDisplay(checks) {
        if (checks.length) {
            lengthRule.classList.add('rule-valid');
        } else {
            lengthRule.classList.remove('rule-valid');
        }
        
        if (checks.upper) {
            upperRule.classList.add('rule-valid');
        } else {
            upperRule.classList.remove('rule-valid');
        }
        
        if (checks.number) {
            numberRule.classList.add('rule-valid');
        } else {
            numberRule.classList.remove('rule-valid');
        }
        
        if (checks.special) {
            specialRule.classList.add('rule-valid');
        } else {
            specialRule.classList.remove('rule-valid');
        }
    }
    
    // Validación en tiempo real mientras se escribe
    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const validationResult = validatePassword(password);
        updateRuleDisplay(validationResult.checks);
    });
});
