# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blog_app.spec.js >> Blog app >> When logged in >> blogs are ordered by likes (most liked first)
- Location: tests\blog_app.spec.js:242:4

# Error details

```
Test timeout of 3000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Blog App" [level=1] [ref=e4]
  - generic [ref=e5]: Welcome Matti Luukkainen
  - generic [ref=e6]:
    - generic [ref=e7]: Matti Luukkainen logged in
    - button "Logout" [ref=e8] [cursor=pointer]
  - button "new blog" [ref=e12] [cursor=pointer]
  - heading "Blogs" [level=2] [ref=e13]
  - generic [ref=e15]:
    - generic [ref=e16]:
      - text: Blog mas likes C
      - button "hide" [ref=e17] [cursor=pointer]
    - generic [ref=e18]: http://test.com
    - generic [ref=e19]: likes 3
    - generic [ref=e20]: Matti Luukkainen
    - button "like" [active] [ref=e21] [cursor=pointer]
    - button "delete" [ref=e22] [cursor=pointer]
  - generic [ref=e24]:
    - generic [ref=e25]:
      - text: Blog medio likes B
      - button "hide" [ref=e26] [cursor=pointer]
    - generic [ref=e27]: http://test.com
    - generic [ref=e28]: likes 2
    - generic [ref=e29]: Matti Luukkainen
    - button "like" [ref=e30] [cursor=pointer]
    - button "delete" [ref=e31] [cursor=pointer]
  - generic [ref=e33]:
    - generic [ref=e34]:
      - text: Blog menos likes A
      - button "hide" [ref=e35] [cursor=pointer]
    - generic [ref=e36]: http://test.com
    - generic [ref=e37]: likes 1
    - generic [ref=e38]: Matti Luukkainen
    - button "like" [ref=e39] [cursor=pointer]
    - button "delete" [ref=e40] [cursor=pointer]
```