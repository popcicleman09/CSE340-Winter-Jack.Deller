/***
 * model file for the review system
 * 
 * this will push and retreive reviews from the database. 
 * with the ability to edit reviews - last goal
 */
const pool = require("../database/")

/**
 * add a review
 */

async function addReview(review_text,inv_id,account_id){
    try {
        return await pool.query(
            `INSERT INTO review(review_text, inv_id, account_id) 
            VALUES ($1, $2, $3) RETURNING *
            `,[review_text,inv_id,account_id]
        )
    } catch (error){
        return error.message;
    }

}

/**
 * update review
 */
async function updateReview(review_id, review_text) {
    try {
        return await pool.query(
            `UPDATE review SET review_text = $1 WHERE review_id = $2 RETURNING *`,
            [review_text,review_id]
        )
    } catch (error){
        return error.message;
    }
}

/**
 * detete a review
 */
async function deleteReview(review_id) {
    try {
        return await pool.query('DELETE FROM review WHERE review_id = $1', [review_id])
    } catch (error) {
        return error.message
    }
}

/**
 * get all reviews for a cat (inv_id)
 */
async function getReviews(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.review WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getReviews error:" + error)
    }
}



module.exports = {addReview, getReviews, updateReview, deleteReview}