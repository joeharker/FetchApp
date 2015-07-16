using Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Text.RegularExpressions;

namespace GenerateLinks
{
	class Program
	{
		static void Main(string[] args)
		{
			try
			{
				List<string> excludes = new List<string> { 
					 "\\resources\\" 
					,"\\unitTests\\"
					,"\\app.js"
					,"cordova.js"
				};
				StringBuilder insert;
				string ROOT = Regex.Replace(System.Reflection.Assembly.GetExecutingAssembly().Location, @"(\\[^\\]+){4}$", "") + @"\Fetch1\";
				string APP_HTML = ROOT + "index.html";
				string html = "";
				string[] files;
				bool skip = false;
				List<SearchFile> searchFiles = new List<SearchFile> {
					new SearchFile{ fileType="styles", searchPattern="*.css", insertFormat=@"<link href=""{0}?ver={1}"" rel=""stylesheet"" />{2}" }
					,new SearchFile{ fileType="scripts", searchPattern="*.js", insertFormat=@"<script src=""{0}?ver={1}""></script>{2}" }
				};

				foreach (SearchFile searchFile in searchFiles)
				{
					Console.WriteLine(searchFile.fileType);
					files = Directory.GetFiles(ROOT, searchFile.searchPattern, SearchOption.AllDirectories);
					insert = new StringBuilder(Environment.NewLine);
					foreach (string file in files)
					{
						skip = false;

						foreach (var x in excludes)
						{
							if (file.IndexOf(x) != -1)
							{
								skip = true;
							}
						}

						if (!skip)
						{
							Console.WriteLine(string.Format("  {0}", file.Replace(ROOT, "")));
							insert.Append(string.Format(
								"\t" + searchFile.insertFormat
								, file.Replace(ROOT, "").Replace("\\", "/")
								, DateTime.Now.ToString("yyyyMMddHHmm")
								, Environment.NewLine
							));
						}
					}

					html = FileHelper.ReadFile(APP_HTML);
					html = Regex.Replace(
						html
						, "(<!-- injected " + searchFile.fileType + " start -->).*?(<!-- injected " + searchFile.fileType + " end -->)"
						, "$1" + insert.ToString() + "$2"
						, RegexOptions.Singleline
					);
					FileHelper.NewFile(APP_HTML);
					FileHelper.Write(APP_HTML, html);
				}
			}
			catch (Exception exc)
			{
				Console.WriteLine(exc.ToString());
			}
			Console.WriteLine("Done");
			Console.ReadKey();
		}
	}
}
