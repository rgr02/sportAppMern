import {Router} from 'express';
import * as PostController from './rest';

const router = new Router();

router.route('/getAllElementsOfCollection').get(PostController.getAllElementsOfCollection);
router.route('/getItemsByKeyValuePair/:key=:value').get(PostController.getItemsByKeyValuePair);
router.route('/postNewElement').post(PostController.postNewElement);
router.route('/deleteElement/:id').delete(PostController.deleteElement);
router.route('/modifyElement').post(PostController.modifyElement);

export default router;

// EXAMPLES
// localhost:8000/api/getItemsByKeyValuePair/name=Marlies
// localhost:8000/api/getItemsByKeyValuePair/achievements$rank=2
// localhost:8000/api/getItemsByKeyValuePair/achievements$event$run=first
// localhost:8000/api/getAllElementsOfCollection
// localhost:8000/api/postNewElement
// localhost:8000/api/deleteElement/5a25c76c9c548aae1d010ddd

