'use client';

import { useState } from 'react';

export default function Calculator() {
  // State variables to manage calculator functionality
  // currentNumber: displays the number currently being entered or result
  // equation: stores the complete mathematical expression
  // hasResult: tracks if the last operation was pressing equals
  // lastWasOperator: tracks if the last button pressed was an operator
  const [currentNumber, setCurrentNumber] = useState('0');
  const [equation, setEquation] = useState('');
  const [hasResult, setHasResult] = useState(false);
  const [lastWasOperator, setLastWasOperator] = useState(false);

  // Main calculation function that processes the mathematical expression
  const calculate = (expression: string): string => {
    try {
      // Split the expression into parts (numbers and operators)
      // Example: "1 + 2" becomes ["1", "+", "2"]
      const parts = expression.split(' ');
      
      // If expression is too short, return the first number
      if (parts.length < 3) return parts[0];
      
      // Start with the first number
      let result = parseFloat(parts[0]);
      
      // Process each operator and number pair
      for (let i = 1; i < parts.length - 1; i += 2) {
        const operator = parts[i];
        const operand = parseFloat(parts[i + 1]);
        
        // Check for invalid numbers
        if (isNaN(operand)) return 'Error';
        
        // Perform the calculation based on the operator
        switch (operator) {
          case '+':
            result += operand;
            break;
          case '-':
            result -= operand;
            break;
          case '*':
            result *= operand;
            break;
          case '/':
            // Check for division by zero
            if (operand === 0) return 'Error';
            result /= operand;
            break;
          default:
            return 'Error';
        }
      }
      
      return result.toString();
    } catch (error) {
      return 'Error';
    }
  };

  // Handles number button clicks (0-9 and decimal point)
  const handleNumber = (number: string) => {
    if (hasResult) {
      // If we just got a result, start a new calculation
      setCurrentNumber(number);
      setEquation(number);
      setHasResult(false);
      setLastWasOperator(false);
    } else {
      if (lastWasOperator) {
        // If last press was an operator, start a new number
        setCurrentNumber(number);
        setEquation(equation + number);
        setLastWasOperator(false);
      } else {
        // Continue building the current number
        if (currentNumber === '0' && number !== '.') {
          // Replace leading zero unless adding decimal point
          setCurrentNumber(number);
          setEquation(equation === '' ? number : equation + number);
        } else if (number === '.' && currentNumber.includes('.')) {
          // Prevent multiple decimal points
          return;
        } else {
          // Build the number normally
          const newNumber = currentNumber === '0' && number === '.' ? '0.' : 
                          currentNumber === '0' ? number : 
                          currentNumber + number;
          setCurrentNumber(newNumber);
          setEquation(equation === '' ? newNumber : equation + number);
        }
      }
    }
  };

  // Handles operator button clicks (+, -, *, /)
  const handleOperator = (operator: string) => {
    if (equation === '') {
      // Allow negative numbers at start
      if (operator === '-') {
        setCurrentNumber('-');
        setEquation('-');
      }
      return;
    }

    // Prevent multiple operators after minus sign
    if (equation === '-') return;

    if (lastWasOperator) {
      // Replace the previous operator
      setEquation(equation.slice(0, -3) + operator + ' ');
    } else {
      // Add operator to equation with proper spacing
      setEquation(equation + ' ' + operator + ' ');
    }
    
    setLastWasOperator(true);
    setHasResult(false);
  };

  // Handles the equals button click
  const handleEqual = () => {
    if (!equation || equation === '-') return;

    // Clean up the equation by removing trailing operators
    const cleanEquation = equation.trim().replace(/[\s+\-*/]+$/, '');
    if (!cleanEquation) return;

    // Calculate and display the result
    const result = calculate(cleanEquation);
    setCurrentNumber(result);
    setEquation(result);
    setHasResult(true);
    setLastWasOperator(false);
  };

  // Handles the clear button click
  const handleClear = () => {
    // Reset calculator to initial state
    setCurrentNumber('0');
    setEquation('');
    setHasResult(false);
    setLastWasOperator(false);
  };

  // Define calculator buttons layout
  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  // Calculator UI
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Calculator display showing equation and current number */}
        <div className="mb-4 bg-gray-900 p-4 rounded">
          <div className="text-gray-400 text-lg mb-2 min-h-6 font-mono">
            {equation || '0'}
          </div>
          <div className="text-white text-4xl font-bold text-right overflow-hidden font-mono">
            {currentNumber}
          </div>
        </div>
        {/* Calculator buttons grid */}
        <div className="grid grid-cols-4 gap-2">
          {/* Clear button spanning full width */}
          <button
            className="col-span-4 bg-red-500 hover:bg-red-600 text-white p-4 rounded"
            onClick={handleClear}
          >
            Clear
          </button>
          {/* Number and operator buttons */}
          {buttons.map((btn) => (
            <button
              key={btn}
              className={`
                ${btn === '=' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}
                text-white p-4 rounded text-xl
              `}
              onClick={() => {
                if (btn === '=') {
                  handleEqual();
                } else if (['+', '-', '*', '/'].includes(btn)) {
                  handleOperator(btn);
                } else {
                  handleNumber(btn);
                }
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 