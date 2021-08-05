// prompt.js

const prompt = Prompt.create()
prompt.title = 'Post this draft'
prompt.message = ''

prompt.addButton('OK', 'OK', true)

prompt.addButton('Delete', 'delete', false)
prompt.addTextField('title', 'Title', draft.lines[0])
prompt.addTextView('summary', 'Alternate summary', '')
prompt.addSwitch('newlines', 'Preserve newlines', false)
prompt.addTextField('repo', 'Repo name', 'amoxtentli')
prompt.addTextField('path', 'Path', 'src/posts')


if (!prompt.show()) {
	context.cancel()
}

const opt_title       = prompt.fieldValues['title']
const opt_repo        = prompt.fieldValues['repo']
const opt_path        = prompt.fieldValues['path']
const opt_newlines    = prompt.fieldValues['newlines']
const opt_summary     = prompt.fieldValues['summary']
const opt_deletePost  = prompt.buttonPressed == 'delete'
