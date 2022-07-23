

#def parse_math(inputs=['$$', '$$'], outputs=["/[", ])



def clean_windows_fp(debug=True):
	with open(filename, 'rw') as file:
		string = file.read()

		first_yaml = string.find('---')
		if first_yaml != -1:
			second_yaml = string[first+3:]
			start_pos = second_yaml + 3 * (start_pos != -1)
		else:
			start_pos = 0


		pattern = re.compile("^(.+)\/([^\/]+)$")
		matches = re.finditer(pattern, string[start_pos:])
		print(f"Found {len(matches)} path patterns for modification.")
		for match in matches:
			s, e = match.span()
			string[s:e].replace('\\', '/') #Replace Backslash with forward slash.

			if debug:
				string[:s] + '<span hidden> Automated Path Cleaning performed! </span>' +` string[s:]


		# Write modified string to file.
		file.write(string)


if __name__ == "__main__":

	import sys

	if len(sys.argv) < 2:
		print("Error : No file passed.")
		exit()

	if len(sys.argv) > 2:
		debug = argv[2]
	else:
		debug = False

	clean_windows_fp(sys.argv[1], debug=debug)