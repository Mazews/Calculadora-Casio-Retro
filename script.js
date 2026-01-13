
// Classe que representa a calculadora
class Calculator {
    constructor(previousElement, currentElement) {
        // Elementos do DOM onde vamos mostrar os números
        this.previousElement = previousElement;
        this.currentElement = currentElement;
        
        // Inicializa a calculadora limpa
        this.clear();
    }
    
    // Limpa todos os valores
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }
    
    // Deleta o último caractere
    delete() {
        // Se está mostrando zero, não faz nada
        if (this.currentOperand === '0') return;
        
        // Remove o último caractere
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        
        // Se ficou vazio, volta pra zero
        if (this.currentOperand === '' || this.currentOperand === '-') {
            this.currentOperand = '0';
        }
        
        this.updateDisplay();
    }
    
    // Adiciona um número ao display
    appendNumber(number) {
        // Trata porcentagem
        if (number === '%') {
            const current = parseFloat(this.currentOperand);
            if (!isNaN(current)) {
                this.currentOperand = (current / 100).toString();
                this.updateDisplay();
            }
            return;
        }
        
        // Impede múltiplos pontos decimais
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Se está em zero e não é ponto, substitui
        if (this.currentOperand === '0') {
            if (number === '.') {
                this.currentOperand = '0.';
            } else {
                this.currentOperand = number.toString();
            }
        } else {
            // Senão, concatena
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        
        this.updateDisplay();
    }
    
    // Escolhe a operação matemática
    chooseOperation(operation) {
        // Se não tem número atual válido, não faz nada
        if (this.currentOperand === '') return;
        
        // Se já tem uma operação anterior, calcula primeiro
        if (this.previousOperand !== '' && this.operation !== undefined) {
            this.compute();
        }
        
        // Define a operação e move o número atual para anterior
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
        
        this.updateDisplay();
    }
    
    // Realiza o cálculo
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        // Se algum número é inválido, não calcula
        if (isNaN(prev) || isNaN(current)) return;
        
        // Realiza a operação baseado no operador escolhido
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                // Previne divisão por zero
                if (current === 0) {
                    this.currentOperand = 'Erro';
                    this.previousOperand = '';
                    this.operation = undefined;
                    this.updateDisplay();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Limita casas decimais para evitar números muito longos
        if (!Number.isInteger(computation)) {
            computation = Math.round(computation * 100000000) / 100000000;
        }
        
        // Atualiza os valores
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        
        this.updateDisplay();
    }
    
    // Inverte o sinal do número
    toggleSign() {
        if (this.currentOperand === '0' || this.currentOperand === '') return;
        
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.slice(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
        
        this.updateDisplay();
    }
    
    // Formata o número para exibição
    getDisplayNumber(number) {
        if (number === 'Erro') return 'Erro';
        
        const stringNumber = number.toString();
        
        // Se o número for muito grande, usa notação científica
        const num = parseFloat(stringNumber);
        if (!isNaN(num) && Math.abs(num) > 999999999) {
            return num.toExponential(6);
        }
        
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            // Formata com separador de milhares
            integerDisplay = integerDigits.toLocaleString('pt-BR', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    // Atualiza o display com os valores atuais
    updateDisplay() {
        this.currentElement.textContent = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousElement.textContent = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousElement.textContent = '';
        }
    }
}

// Inicializa a calculadora quando a página carrega
const previousElement = document.getElementById('previous');
const currentElement = document.getElementById('current');

const calculator = new Calculator(previousElement, currentElement);

// Suporte para teclado
document.addEventListener('keydown', function(event) {
    // Números
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
    }
    
    // Ponto decimal
    if (event.key === '.' || event.key === ',') {
        calculator.appendNumber('.');
    }
    
    // Operações
    if (event.key === '+') calculator.chooseOperation('+');
    if (event.key === '-') calculator.chooseOperation('-');
    if (event.key === '*') calculator.chooseOperation('×');
    if (event.key === '/') {
        event.preventDefault(); // Previne busca no navegador
        calculator.chooseOperation('÷');
    }
    
    // Enter ou = para calcular
    if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
    }
    
    // Backspace para deletar
    if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.delete();
    }
    
    // Escape para limpar
    if (event.key === 'Escape') {
        calculator.clear();
    }
});