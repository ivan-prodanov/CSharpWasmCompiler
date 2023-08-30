export const ProjectName: string = 'WASM_TEST_PROJECT';
export const FileName: string = 'WasmFile1';
export const InitialCsharpCode: string = `// Hey There!
// This is part of the "The WASM.SDK" project thesis for New Bulgarian University
// By Ivan Prodanov (FN 98060)
// Check out the README.cs file for more information.

// I have some objectives for you:
// 0. Run the project (green Arrow in the top left corner above App.cs)
// 1. Fix the errors and warnings  (The PROBLEMS panel below will guide you through)
// 2. Run the project again
// 3. Observe all the features provided by the compiler - go to Definition, Auto Complete, Code Lens, 
//    Quick Fixes, Syntax Highlighting, any many more (press F1 to see)!
// 4. Install this as a PWA app (top right corner in the address bar of your browser)
// 
// Enjoy. You are compiling and executing C# within your browser with 0 backend connectivity

using System;

namespace ConsoleApp1
{
    class App
    {
        private HelperClass _helper;

        public App() => _helper = new HelperClass();
        
        //                            ^you can right click -> go to defition to see the correct method name
        private string GetText() => _helper.RandomNumber().ToString();

        public void Run(string[] args)
        {
            string variable = "should generate an unused variable warning!";
            Console.WriteLine($"Hello World {GetText()}!");
            //      ^ hovering with the mouse shows documentation. Also avaialble with auto complete (Ctrl+Space twice)
        }
    }
}`;

export const InitialProgramCode: string = `namespace ConsoleApp1
{
    // Some things in life are read-only.
    // Unfortunately.
    class Program
    {
        public static void Main(string[] args)
        {
            var app = new App();
            app.Run(args);
        }
    }
}
`;

export const InitialTypingsCode: string = `namespace ConsoleApp1
{
    class Typings
    {
        public static string Types { get; set; } = "Types";
    }
}
`;

export const HelperClassCode: string = `namespace ConsoleApp1
{
    /// <summary>
    /// A HelperClass that is pretty useless but nevertheless helps demonstrate capabilities
    /// </summary>
    class HelperClass
    {
        /// <summary>
        /// Wild guess. It returns a a random number.
        /// </summary>
        /// <returns>a random number chosen by fair dice roll. Guaranteed to be random.</returns>
        public int GetRandomNumber()
        {
            // when you hover over an error, a "Quick fix" appears. Try it.
            // Hint: Random is in the namespace System. Check the usings.
            return new Random().Next();
        }
    }
}
`;

export const ReadMeClassCode: string = `/*

Demonstrating newly created infrastructure projects can be challenging. 
However, showcasing the capabilities of the underlying infrastructure 
by solving real-world problems is one effective approach.

What's the problem? 
There are plenty of solutions online for compiling C# in a browser.
They all manage to do this by exposing the C# compiler through a WEB API backend
which is accessed by the front-end web site in the browser while the code is being written/compiling.
This requires internet, it does NOT work while you're offline, you cannot reach the backend!
How do we write, compile, and execute C# in our browsers, without installing any additional software, while being offline?
We simply can't.

What's the solution?
We expose the C# compiler through WebAssembly.

Why has nobody thought about this?
There is no tooling to easily do this and do it properly. 
1. Blazor's .net wasm runtime does not operate well in web workers, it requires the WASM be loaded on the main thread. We don't want to block the main thread while compiling stuff.
2. Blazor's .net wasm runtime does not allow more than one runtime to be loaded at a time. We don't want to block the compilation of code & analysis while the the code is executing.
3. Blazor's .net wasm runtime requires razor. But the C# in Razor runs in its own WASM module which severely impacts performance. C# wasm cant' be used from other frameworks (react, angular,..).

Fortunately, WASM.SDK solves this for us:
1. Empowers front-end frameworks of your choice, such as React, Angular, and others, to seamlessly utilize C# code through 
   a simple WASM Controller class, ensuring high performance and flexibility.
2. Generates TypeScript code that automatically exposes the methods of the WASM Controller class, 
   abstracting away the complexity of type conversions and enabling seamless integration.
3. Automatically generates TypeScript code that facilitates running the WASM Module in a dedicated Web Worker, 
   simplifying the setup and management of the Web Worker environment.
4. Packages all of these capabilities into an NPM package, providing seamless integration experience with React, Angular, and other popular frameworks.

What can be reused?
To achieve Minimum Vaiable Product, we can reuse existing code as much as humanly posssible:
1. Visual Studio Code is a desktop app but its core editor is available as an NPM package (Monaco Editor), it must be extended to support AutoComplete, code lens, etc. but requires hooks & language servers.
2. ^ The C# extension for Visual Studio Code called OmniSharp, exposes C# code (for AUtoComplete, diagnostics, CodeLens, etc.) through an HTTP server.
3. The same C# extension also integrates VS Code's advanced features for C# (AutoComplete, diagnostics, CodeLens, etc.) with the exposed C# code in the HTTP server.

We can split our work in 3 integral directions:
1. Code Analysis & Compilation.
   By modifying the OmniSharp codebase to fit WASM, we will implement the advanced C# features (AutoComplete, diagnostics, CodeLens) without blocking the main thread.
2. Code Execution.
   Using WASM we can expose a module that, given a compiled assembly, executes the Main entry point of the assembly without blocking the main thread
3. User interface.
   Starting with Monaco Editor, we extend the editor by integrating it with the library from Step 1, we add UI for multiple files, diagnostics, output terminal, tabs, etc.

Task breakdown:

1.0. To implement the advanced C# features (AutoComplete, diagnostics, etc. ) in the Monaco Editor, we need OmniSharp.
1.1. Strip OmniSharp's C# backend from its file system code (we can't do this in WASM).
1.2. Expose all the OmniSharp APIs (AutoComplete, Hover, diagnostics, CodeLens, and many more) through a WASM Controller class.
1.3. Add Wasm.Sdk NuGet => The methods in the WASM Controller class are now exposed through TypeScript (compiler generated).
1.4. Add OmniSharp's TypeScript frontend code. Replace the HTTP calls with the generated TypeScript calls to the WASM in the previous step.
1.5. Compile. OmniSharp is now exposed through WASM, has all necessary Monaco Editor code provider, all packaged into 1 NPM package.
1.5. Let's call this OmniWasm.

2.0. For the C# execution module, create a new C# lib project.
2.2. Create a method which takes a byte[] array (compiled dll assembly) and executes the Main function within the said assembly.
2.3. Expose the logic through a WASM Controller class.
2.4 Add Wasm.Sdk NuGet and compile => the method is the WASM controller is now exposed through TypeScript (compiler generated).
2.5 Compile. You get a NPM package which exposes a method that executes C# code through WASM.
2.5 Let's call this WasmRunner.

3.0 To create the UI, Create a new React project
3.1 Install the Monaco Editor NPM package, as mentioned earlier, it's the core editor in Visual Studio Code.
3.2 Design and implement a panel for file navigation on the left side of the application.
3.3 Create panels for displaying Problems, Output, and Terminal sections at the bottom of the application.
3.4 Implement a tabs panel at the top to support multiple open files.
3.5 Install the OmniWasm NPM package, which enables spinning off its WASM module on a separate Web Worker (Thread) with just one method call.
3.6 Integrate all the Monaco Editor advanced features with the OmniWasm's TypeScript.
3.6 Install the WasmRunner NPM package, which also enables spinning off its WASM module on a separate Web Worker (Thread) with a single method call.
3.7 Connect all the components and functionalities together, 
    ensuring proper integration and communication between the Monaco Editor, file panels, output panels, and the Web Workers (OmniWasm and WasmRunner).

Our React project utilizes two Web Worker Threads, OmniWasm and WasmRunner, which both leverage WebAssembly. 
OmniWasm handles tasks related to the Code Editor, such as compiling and diagnostics, ensuring a non-blocking UI experience. 
WasmRunner is responsible for executing C# code, preventing UI and compiler blocking during execution.

Done!

A lot can be achieved quickly be reusing existing code!
Wasm.SDK is exactly this - a modified wasm .net runtime.
1. Enables the utilization of C# WASM in any web application framework, without relying on specific technologies like Blazor or Razor, 
   ensuring compatibility and flexibility across different frameworks.
2. Tailored specifically for multi-threaded environments, allowing seamless integration and optimal performance.
3. Generates extensive boilerplate C# and TypeScript code, abstracting away complexity and streamlining the development
   process to make it easier and more efficient.

This project is a prime example demonstrating the ability to effortless access C# code from multi-threaded environments in various web app frameworks
such as React/Angular/Svelte using Wasm.SDK.

*/`;

export const Language: string = 'csharp';
