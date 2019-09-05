const express = require('express');
const db = require('./userDb')
const UsersPosts = require('../posts/postDb')
const router = express.Router();
router.use(express.json());



router.post('/', validateUser ,(req, res) => {
    const newUser = req.body;
    db.insert(newUser)
    .then(newUser => {
        if(newUser){
            res.status(200).json(newUser)
        }
    })
    .catch(() => {
        res.status(404).json({
            message: 'error soemthing is wrong'
        })
    });
});

router.post('/:id/posts',validateUserId, validatePost, (req, res) => {
    const userID = req.params.id;
    req.body.user_id = userID
    Posts.insert(req.body)
        .then(post => {
            res.status(201).json(post)
        })
        .catch(error => {
            res.status(500).json({error: "Server couldn't process your request"});
        });
});

router.get('/', (req, res) => {
    db.get()
    .then(users => {
        res.status(200).json({users})
    })
    .catch(() => {
        res.status(404).json({
            message: 'error soemthing is wrong'
        })
    });
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId , (req, res) => {
    const { id } = req.params
    
    db.getUserPosts(id)
    .then(posts => {
        res.status(200).json(posts)
    })
    .catch(() => {
        res.status(404).json({
            message: 'error soemthing is wrong'
        })
    });

});

router.delete('/:id',validateUserId , (req, res) => {
    const { id } = req.params;
    db.remove(id)
    .then(deletedUser => {
        res.status(200).json(deletedUser)
    })
    .catch(() => {
        res.status(404).json({
            message: 'error soemthing is wrong'
        })
    });

});

router.put('/:id',validateUserId, validateUser,  (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    db.update(id , changes)
    .then(updatedUser => {
        res.status(200).json(updatedUser)
    })
    .catch(() => {
        res.status(404).json({
            message: 'error soemthing is wrong'
        })
    });
});

//custom middleware

function validateUserId(req, res, next) {
    const { id } = req.params;
    Users.getById(id).then( user => {
        if(user){
            req.user = user;
            next();
        } else {
            res.status(400).json({message: "invalid user id"});
        };
    }).catch(error => {
        res.status(500).json({error: "Server couldn't process your request"})
    });
};

function validateUser(req, res, next) {
    if(JSON.stringify(req.body) !== '{}'){
        if(req.body.name){
            next();
        } else {
            res.status(400).json({message: "missing required name feild"})
        }
    } else {
        res.status(400).json({message: "missing user data"})
    };
};

function validatePost(req, res, next) {
    if(JSON.stringify(req.body) !== '{}'){
        if(req.body.text){
            next();
        } else {
            res.status(400).json({message: "missing required text field"});
        }
    } else {
        res.status(400).json({message: "missing post data"});
    }
};

module.exports = router;
