import { sql } from "../db/db.js";

// const handleError = (res, error, message) => {
//     console.error(message, error);
//     return res.status(500).json({ 
//         message: "Internal server error",
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
// };

export async function getTransactionId(req,res) {
    
        try {
           const{UserId} = req.params;
           const transaction = await sql`SELECT * FROM transactions WHERE user_id = ${UserId} order by created_at desc`
           return res.status(200).json(transaction); 
        } catch (error) {
            console.log("the error in getting transaction",error);
            return res.status(500).json({message:"transaction Error"});
        }
    }

export async function deleteTransaction(req,res){
        
            try {
                const{ id } = req.params;
                //it convert into number and check (is not a number)
                if(isNaN(parseInt(id))){
                     return res.status(500).json({message:"Invalid Transaction Id"});
                }
                const result = await sql`DELETE FROM transactions where id = ${id} returning *`
                if((result.length === 0)){
                    return res.status(500).json({message:"Transaction not deleted"});
                }
                return res.status(200).json({message:"Transaction Deleted SucessFully"});
        
            } catch (error) {
                console.log("the error in deleting transaction",error);
                return res.status(500).json({message:"transaction Error"});
            }
        }

export async function insertTransaction(res,req){
    
        try {
            const{ user_id,title,amount,category}=req.body;
    
            //why not !amount.. amount =0 is false when !amount it become true 
            if(!title||amount === undefined|| !category || !user_id){
                  //400 - bad request . invalid 
                  return res.status(400).json({message:"Invalid Field Please Fill"});
            }
            //why await because js wait untill the statement is finished
            const transaction = await sql`
            insert into transactions(user_id,title,amount,category) values(${user_id},${title},${amount},${category}) returning *`
            console.log(transaction);
            return res.status(200).json({
              message: "Successfully Transaction",
              data: transaction[0]
        });
        } catch (error) {
            console.log("the error in transaction",error);
            return res.status(500).json({message:"transaction Error"});
        }
    }

export async function getTransactionDetials(res,req) {
    
        try{
        const{UserId} = req.params;
        const balance = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions where user_id = ${UserId}`;
        const income  = await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions where user_id = ${UserId} AND amount > 0`;
        const expense = await sql`SELECT COALESCE(SUM(amount),0) as expense FROM transactions where user_id = ${UserId} AND amount<0`;
    
        return res.status(200).json({
            balance:balance[0].balance,
            income :income[0].income,
            expense:expense[0].expense
        }
        )}
        catch(e){
             console.log("the error in transaction",e);
             return res.status(500).json({message:"transaction summary Error"});
        }
    }


// export async function getTransactionId(req, res) {
//     try {
//         const {UserId} = req.params;
//         console.log("Fetching transactions for user:", UserId);
        
//         const transaction = await sql`SELECT * FROM transactions WHERE user_id = ${UserId} order by created_at desc`;
//         console.log("Found transactions:", transaction.length);
        
//         return res.status(200).json(transaction);
//     } catch (error) {
//         console.error("Database error in getTransactionId:", error);
//         return res.status(500).json({ 
//             message: "Database error",
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined
//         });
//     }
// }

// export async function deleteTransaction(req, res) {
//     try {
//         const { id } = req.params;
//         // it convert into number and check (is not a number)
//         if (isNaN(parseInt(id))) {
//             return res.status(500).json({ message: "Invalid Transaction Id" });
//         }
//         const result = await sql`DELETE FROM transactions where id = ${id} returning *`;
//         if ((result.length === 0)) {
//             return res.status(500).json({ message: "Transaction not deleted" });
//         }
//         return res.status(200).json({ message: "Transaction Deleted SucessFully" });

//     } catch (error) {
//        return handleError(res, error, "Error in getting transaction:");
//     }
// }

// // ✅ CORRECTED: req comes first, then res
// export async function insertTransaction(req, res) {
//     try {
//         const { user_id, title, amount, category } = req.body;

//         // why not !amount.. amount =0 is false when !amount it become true 
//         if (!title || amount === undefined || !category || !user_id) {
//             // 400 - bad request . invalid 
//             return res.status(400).json({ message: "Invalid Field Please Fill" });
//         }
//         // why await because js wait untill the statement is finished
//         const transaction = await sql`
//             insert into transactions(user_id, title, amount, category) values(${user_id}, ${title}, ${amount}, ${category}) returning *`;
//         console.log(transaction);
//         return res.status(200).json({
//             message: "Successfully Transaction",
//             data: transaction[0]
//         });
//     } catch (error) {
//        return handleError(res, error, "Error in getting transaction:");
//     }
// }

// // ✅ CORRECTED: req comes first, then res
// export async function getTransactionDetials(req, res) {
//     try {
//         const { UserId } = req.params;
//         const balance = await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions where user_id = ${UserId}`;
//         const income = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions where user_id = ${UserId} AND amount > 0`;
//         const expense = await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions where user_id = ${UserId} AND amount < 0`;

//         return res.status(200).json({
//             balance: balance[0].balance,
//             income: income[0].income,
//             expense: expense[0].expense
//         });
//     } catch (e) {
//         return handleError(res, error, "Error in getting transaction:");
//     }
// }