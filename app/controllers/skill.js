import express from 'express';
const router = express.Router();
import Skill from '../models/Skill';

module.exports = (app) => {
  app.use('/api/v1/skills', router);
};


router.post('/add', (req, res) =>{
  if(req.body) {
    let newSkill = new Skill(req.body.skill);
    // newSkill.user = req.user._id;
    newSkill.save().then(skill =>{
      res.json({status: 'OK', skill});
    }).catch(error =>{
      res.status(404).json({message: error.message});
    });
  } else {
    res.status(404).json({message: 'Invalid skill'});
  }
});

router.get('/get', (req, res) =>{
  Skill.find({}).sort({'createdAt': -1}).then(skills=>{
    res.json({skills});
  }).catch(error=>{
    res.status(404).json({message: error.message});
  });
});

router.delete('/remove/:id', (req, res) =>{
  Skill.findByIdAndRemove(req.params.id).then(status=>{
    if (status)
      res.json({ status: 'OK', id: req.params.id });
  }).catch(error=>{
    res.status(404).json({ message: error.message });
  });
});

router.post('/archive/:id', (req, res) =>{
  Skill.findById(req.params.id).then(skill=>{
    if (skill.status == 0)
      skill.status = 1;
    else if (skill.status == 1)
      skill.status = 0;
    skill.save().then( status => {
      if(status)
        res.json({ status: 'OK', skill });
    }).catch( error => {
      res.status(500).json({ message: error.message });
    });
  }).catch(error=>{
    res.status(404).json({ message: error.message });
  });
});

router.get('/:skillSubject', (req, res, next) =>{
  Skill.findOne({$or:[{subject: req.params.skillSubject.toLowerCase()}, {subject: req.params.skillSubject.toUpperCase()}]}).then(skill =>{
    res.json({title: skill.subject,user: req.user, skill});
  }).catch(error =>{
    next(error);
  });
});
