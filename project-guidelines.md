# Project guid-lines

## Source Control Management (SCM)
- add new feature
    1. create a branch from backend-main or frontend-main name the branch prefix (feature-) ex: <b>feature-feature-name</b>.
        ```bash
        git switch backend-main
        git branch feature-feature-name/your-name
        git checkout feature-feature-name/your-name
        work in your own branch
        ```
    2. how to commit?
        
        ```
        - git add .
        - git commit -m "add message related to commit"
        - git push
        - open pull request afterwards and don't forget to assign reviewers 

        ```

    3. raise a pull request to the base backend-main or frontend-main to feature branch.
    ```
        - goto [link](https://github.com/Ambrish5211/SACRED-HEARTS/pulls)
        - create new pull request
        - base (from which you have created branch)
        - compare (your new feature branch name )
    ```    
    4. request review to other collaborator.
    5. wait for review approval.
    6. merge you branch (need review request to be approved by at-least one reviewers).

- add new issue
    1. goto [link](https://github.com/Ambrish5211/SACRED-HEARTS/issues)
    2. add new issue, 
        - Title (error message with branch name).
        - copy paste the full length error message
