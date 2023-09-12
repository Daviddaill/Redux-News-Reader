import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const loadCommentsForArticleId = createAsyncThunk(
  'comments/loadCommentsForArticleId',
  async (articleId) => {
    
      // Make an asynchronous request to fetch comments for the given article id
      const response = await fetch(`api/articles/${articleId}/comments`);
      // Await and parse the JSON data from the response
      const json = await response.json();
      // Return the JSON data
      return json;
    
  }
);
export const postCommentForArticleId= createAsyncThunk('comments/postCommentForArticleId', async ({ articleId, comment})=>{
  const requestBody = JSON.stringify({comment});
  const response= await fetch(`api/articles/${articleId}/comments`,{
    method:'POST',
    body: requestBody,
  });
  const json= await response.json();
  return json;
})

// Step 4: Update the initial state
export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    byArticleId: {}, // An object to store comments by article ID
    isLoadingComments: false, // Boolean to track loading state
    failedToLoadComments: false, // Boolean to track failure state
    createCommentIsPending: false,
    failedToCreateComment:false,
  },

  extraReducers: (builder) => {
    builder
    // 3 promise for Loading Comments ( for the article id):
      .addCase(loadCommentsForArticleId.pending, (state) => {
        // Handle pending state
        state.isLoadingComments = true;
        state.failedToLoadComments = false;
      })
      .addCase(loadCommentsForArticleId.fulfilled, (state, action) => {
        // Handle fulfilled state
        state.isLoadingComments = false;
        state.failedToLoadComments = false;
      // const articleId = action.meta.arg; // Get the article ID from the action
        // Assuming action.payload is an array of comments, store it by article ID
      state.byArticleId[action.payload.articleId]= action.payload.comments
      })
      .addCase(loadCommentsForArticleId.rejected, (state) => {
        // Handle rejected state
        state.isLoadingComments = false;
        state.failedToLoadComments = true;
      })
   //3 promises for posting comments (for the article id):  
       .addCase(postCommentForArticleId.pending, (state) => {
        // Handle pending state
        state.createCommentIsPending = true;
        state.failedToCreateComment = false;
      })
      .addCase(postCommentForArticleId.fulfilled, (state, action) => {
        // Handle fulfilled state
        state.createCommentIsPending = false;
        state.failedToCreateComment = false;
        //push the comment object in the comment array, comment array is the value of the article id key in the byArticleObject: 
        state.byArticleId[action.payload.articleId].push(action.payload);
        console.log('state.by article: '+ state.byArticleId);
        console.log('articleID: '+ state.byArticleId[action.payload.articleId]);
        console.log('comment: '+ action.payload.comment)
      })
      .addCase(postCommentForArticleId.rejected, (state) => {
        // Handle rejected state
        state.createCommentIsPending = false;
        state.failedToCreateComment = true;
      })    
      ;
  },
});

// Export selectors
export const selectComments = (state) => state.comments.byArticleId;
export const isLoadingComments = (state) => state.comments.isLoadingComments;
export const createCommentIsPending = (state) => state.comments.createCommentIsPending;

export default commentsSlice.reducer;
