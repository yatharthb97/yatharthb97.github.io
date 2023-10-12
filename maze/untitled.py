

"""
1. The Maze generator — within the scope of the maze, the program generates `N`
folders with a uuid wher N is a random number between 1 and 10.

2. And then create a filename with uuid. Search excluded. No tags. As clean as possible, based on a stereotype.

3. Shorten URL


"""

CUTTLY_API_KEY = "395c00f7aea6f893e402cd60d4994df76d80c"


from uuid import uuid4
def random_tree_gen(max_depth=10, max_noise=10):
	"""
	Returns a random directory in a randomly generated directory tree.

	from the docs: Since there is a bijection between Prüfer sequences of length n - 2 and trees on n nodes, the tree is chosen uniformly at random from the set of all trees on n nodes.

	Hence `n-2` 
	"""
	from urandom 
	tree = nx.random_tree(n=max_depth*max_noise, seed=urandom)
	print(nx.forest_str(tree, sources=[0]))



def shorten_url(url, api_key=CUTTLY_API_KEY):
	import requests
	api_url = f"https://cutt.ly/api/api.php?key={api_key}&short={url}"
	data	 = requests.get(api_url).json()["url"]
	if data["status"] == 7:
		shortened_url = data["shortLink"]
		print("Shortened URL:", shortened_url)
		return shorten_url
	else:
		print("[!] Error Shortening URL:", data)
		return url
