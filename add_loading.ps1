$content = Get-Content 'd:\Urban Catalogue\urban-catalogue\index.html' -Raw
$content = $content -replace '(    <main>\r\n        <div id="product-list"></div>)', '    <main>`r`n        <div id="loading" class="loading"></div>`r`n        <div id="product-list"></div>'
Set-Content 'd:\Urban Catalogue\urban-catalogue\index.html' $content
