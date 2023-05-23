# Scope
1. 10
2. 5
   10
3. 5
4. 5
   5
   WRONG! Reference error because Node actually knows the declaration of num within the function hasn't happened.
5. 10
   WRONG! I missed that there was a parameter defined for the function!
6. 3
7. Error that num is already defined.
   WRONG! Infinite loop because you can define a separate variable within the block.

# Objects vs. Primitives
1. Hello
2. Hello
   Hello
   Hello
3. ['Hello', 'Goodbye']
4. ['Hello', 'Goodbye']
   WRONG! Array.concat doesn't mutate the array, it returns a new array.
5. ['Hello']
6. ['HELLO']

# Variables as Pointers
1. Hello
   Hello
2. Goodbye
   Hello
3. ['Hi', 'Goodbye']
   ['Hi', 'Goodbye']
4. ['Hi', 'Bye']
   ['Hello', 'Goodbye']
5. Error, because index 0 of a String is a single character
   WRONG! I missed that myWord vs. myWords. Also, you don't get an error when trying to assign a string to index 0 or a String.
6. ['Hi', 'Goodbye']
   Hello

# Pass by Reference vs. Pass by Value
Reassignment is not destructive!!!
1. Hello
   Hello
2. Hello
   HELLO
3. Hello
   Hello
   HELLO
4. ['Hello', 'Goodbye']
   ['Hi', 'Goodbye']
5. ['Hello', 'Goodbye']
   ['Hello', 'Goodbye']

# Variables, Functions and Blocks
1. ['red', 'green', 'blue', 'yellow']
2. ['red', 'green', 'blue', undefined]
3. ['red', 'green', 'blue', 'purple', 'pink']
4. ['red', 'green', 'blue', 'purple', 'pink']
5. ['red', 'green', 'blue']
6. hello
   Hello
   Hello!!!
   WRONG! We actually mutated the global variable word, so it should be:
   hello!!!
   Hello
   hello!!!
7. hello
   Hello
   Hello!!!