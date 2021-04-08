const express = require("express");
const router = express.Router();
const _ = require('lodash');
const {Blog, validateBlog} = require("../models/blog");
const authorisation = require("../middleware/authorization");
const administration = require("../middleware/administration");


//Creating single Blog object - admin rights only.
router.post('/',[authorisation,administration],async(req, res) => {
    const {error} = validateBlog(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let blog = await Blog.findOne({blogTitle: req.body.blogTitle});
    const reqBlogTitle = req.body.blogTitle;
    if(blog) return res.status(409).send(`Blog with ID: ${reqBlogTitle} already exists!`);

    blog = new Blog(_.pick(req.body,['blogTitle','blogSubTitle','blogText','blogPictures','blogLink']));
    await blog.save();
    res.send(blog);
})


//Retrieving all the Blog objects from the DB - no token needed.
router.get('/',async(req, res) => {
    const blogs = await Blog.find().sort('_id');
    res.send(blogs);
})


//Retrieving single Blog object from the DB - no token needed.
router.get('/:id', async(req, res) => {
    const blog = await Blog.findById(req.params.id);
    if(!blog) return res.status(404).send('Blog with the given ID was not found!');
    res.send(blog);
})


//Updating single Blog object - admin rights only.
router.put('/:id',[authorisation,administration], async(req, res) => {
    const {error} = validateBlog(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const blog = await Blog.findByIdAndUpdate(req.params.id,{
        blogTitle: req.body.blogTitle,
        blogSubTitle: req.body.blogSubTitle,
        blogText: req.body.blogText,
        blogPictures: req.body.blogPictures,
        blogLink: req.body.blogLink
    },{new:true});

    if(!blog) return res.status(404).send('Blog with the given ID was not found!');
})


//Deleting single Blog object - admin rights only.
router.delete('/:id',[authorisation,administration],async(req, res) => {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    let reqBlogId = req.params.id;
    if(!blog) return res.status(404).send(`Blog with ID : ${reqBlogId} was not found!`);
    res.send(blog);
})


module.exports=router;
