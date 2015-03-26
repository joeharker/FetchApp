using System;
using System.Diagnostics;

//to view a file	ConsoleHelper.ExecuteCommand("cmd", "/c dump.htm");
namespace Helpers
{
	public static class ConsoleHelper
	{
		const int WAIT_TIMEOUT = 2000;
		private static int rotation = 0;

		public static string ExecuteCommand(string command, string paramstring, bool verboseConsole = false)
		{
			int exitCode;
			ProcessStartInfo processInfo;
			Process process;
			string output;
			string error;

			processInfo = new ProcessStartInfo(command, paramstring);
			processInfo.CreateNoWindow = true;
			processInfo.UseShellExecute = false;

			// *** Redirect the output ***
			processInfo.RedirectStandardError = true;
			processInfo.RedirectStandardOutput = true;

			if (verboseConsole)
			{
				Console.WriteLine("Cmd:    " + command + " " + paramstring);
			}
			using (process = Process.Start(processInfo))
			{
				process.WaitForExit(WAIT_TIMEOUT);

				// *** Read the streams ***
				output = process.StandardOutput.ReadToEnd();
				error = process.StandardError.ReadToEnd();
				exitCode = process.ExitCode;

				if (verboseConsole)
				{
					Console.WriteLine("Errors: " + (String.IsNullOrEmpty(error) ? "(none)" : error));
					Console.WriteLine("ExitCo: " + exitCode.ToString());
					Console.WriteLine("Output: " + Environment.NewLine + (String.IsNullOrEmpty(output) ? "(none)" : output));
				}
			}

			return output;
		}
		
		public static void ExecuteAsyncCommand(string command, string paramstring, bool verboseConsole = false)
		{
			if (verboseConsole)
			{
				Console.WriteLine("Cmd:    " + command + " " + paramstring);
			}
			Process.Start(command, paramstring);
		}

		public static void WriteSpin()
		{
			string spinner = @"|/-\";
			ConsoleColor orriginal = Console.ForegroundColor;

			rotation = (rotation + 1) % spinner.Length;
			Console.ForegroundColor = ConsoleColor.Cyan;
			Console.Write(spinner[rotation]);
			Console.SetCursorPosition(Console.CursorLeft - 1, Console.CursorTop);
			Console.ForegroundColor = orriginal;
		}
	}
}
