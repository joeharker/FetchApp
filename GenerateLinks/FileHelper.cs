using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Collections.Generic;

namespace Helpers
{
	public static class FileHelper
	{
		//private static string FILE_PATH = Environment.CurrentDirectory + "\\" + System.Reflection.Assembly.GetExecutingAssembly().GetName().Name + ".log";

		/// <summary>used to clear the file</summary>
		public static void NewFile(string path)
		{
			FileStream logStream;
			StreamWriter logWriter;

			BuildDirectories(Path.GetDirectoryName(path));
			using (logStream = new FileStream(path, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite))
			{
				using (logWriter = new StreamWriter(logStream, Encoding.ASCII))
				{
					logWriter.Flush();
				}
			}
		}

		/// <summary>used to write to the file</summary>
		/// <param name="message">the message to write</param>
		public static void Write(string path, string message)
		{
			FileStream logStream;
			StreamWriter logWriter;
			int tries = 100;
			bool success = false;

			//its suprising how often a closed file is not ready to be written to
			while (tries > 0 && !success)
			{
				try
				{
					File.SetAttributes(path, FileAttributes.Normal);
					using (logStream = new FileStream(path, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite))
					{
						using (logWriter = new StreamWriter(logStream, Encoding.ASCII))
						{
							logStream.Position = logStream.Length;
							logWriter.Write(message);
							logWriter.Flush();

							success = true;	//success writing to file - alow exit
						}
					}
				}
				catch (IOException exc)
				{
					ConsoleHelper.WriteSpin();	//just for fun
					tries--;
					if (tries == 0)
					{
						Console.WriteLine(exc.ToString());
					}
				}
			}
		}

		public static void WriteLine(string path, string message)
		{
			Write(path, message + Environment.NewLine);
		}

		public static string ReadFile(string path)
		{
			FileStream stream;
			StreamReader reader;
			string text = "";
			int tries = 100;
			bool success = false;

			//its suprising how often a closed file is not ready to be written to
			while (tries > 0 && !success)
			{
				try
				{
					File.SetAttributes(path, FileAttributes.Normal);
					using (stream = new FileStream(path, FileMode.Open, FileAccess.ReadWrite, FileShare.ReadWrite))
					{
						reader = new StreamReader(stream, Encoding.ASCII);
						text = reader.ReadToEnd();
						reader.Close();

						success = true;	//success reading file - alow exit
					}
				}
				catch (IOException exc)
				{
					ConsoleHelper.WriteSpin();	//just for fun
					tries--;
					if (tries == 0)
					{
						Console.WriteLine(exc.ToString());
					}
				}
			}

			return text;
		}

		public static void MoveFile(string source, string dest)
		{
			BuildDirectories(Path.GetDirectoryName(dest));
			DeleteFile(dest);
			File.Move(source, dest);
		}

		public static void CopyFile(string source, string dest)
		{
			BuildDirectories(Path.GetDirectoryName(dest));
			DeleteFile(dest);
			File.Copy(source, dest);
		}

		public static bool DeleteFile(string path)
		{
			int maxTries = 100;

			if (File.Exists(path))
			{
				File.SetAttributes(path, FileAttributes.Normal);
				File.Delete(path);

				//confirm the file is deleted
				while (File.Exists(path) && maxTries > 0)
				{
					maxTries--;
					Thread.Sleep(100);
				}
			}

			return maxTries > 0;
		}

		public static bool DeleteDirectory(string path)
		{
			int maxTries = 100;

			if (Directory.Exists(path) && NukeFiles(path, true))
			{
				Directory.Delete(path, true);

				//confirm the dir is deleted
				while (Directory.Exists(path) && maxTries > 0)
				{
					maxTries--;
					Thread.Sleep(100);
				}
			}

			return maxTries > 0;
		}

		public static void BuildDirectories(string finalDirectory)
		{
			List<string> missingParents = new List<string>();
			string parent = finalDirectory;

			while (!string.IsNullOrEmpty(parent) && !Directory.Exists(parent))
			{
				missingParents.Add(parent);
				parent = Directory.GetParent(parent).FullName;
			}
			for (int p = missingParents.Count - 1; p >= 0; p--)
			{
				Directory.CreateDirectory(missingParents[p]);
				ConsoleHelper.WriteSpin();	//just for fun
			}
		}

		private static bool NukeFiles(string path, bool recursive)
		{
			bool success = true;
			string[] paths;

			if (Directory.Exists(path))
			{
				if (recursive)
				{
					paths = Directory.GetDirectories(path);
					foreach (string dir in paths)
					{
						success = NukeFiles(dir, recursive);
						success = success && DeleteDirectory(dir);
						ConsoleHelper.WriteSpin();	//just for fun
					}
				}

				paths = Directory.GetFiles(path);
				foreach (string file in paths)
				{
					success = success && DeleteFile(file);
					ConsoleHelper.WriteSpin();	//just for fun
				}
			}

			return success;
		}
	}
}
