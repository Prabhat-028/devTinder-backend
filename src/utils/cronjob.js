// const { subDays, startOfDay, endOfDay } = require("date-fns");
// const cron = require("node-cron");
// const connectionRequestModel = require("../models/connectionRequest");
// const sesSendEmail = require("./sesSendEmail");

// cron.schedule(
//     "* * * * * *",
//     async () => {
//         try {
//             const yesterday = subDays(new Date(), 1);
//             const startOfYesterday = startOfDay(yesterday);
//             const endOfYesterday = endOfDay(yesterday);

//            const pendingRequest = await connectionRequestModel
//                .find({
//                    status: "interested",
//                    createdAt: {
//                        $gte: startOfYesterday,
//                        $lt: endOfYesterday,
//                    },
//                })
// 				.populate({ path: "toUserId", select: "emailId" });
			
// 			// console.log(
//             //     pendingRequest.map((r) => ({
//             //         toUserId: r.toUserId,
//             //         email: r.toUserId?.emailId,
//             //     }))
//             // );



//             const listOfEmail = [
//                 ...new Set(pendingRequest.map((req) => req.toUserId.emailId)),
//             ];

//             // console.log(listOfEmail);

//             for (const email of listOfEmail) {
//                 try {
//                     // email is ignored internally (hardcoded)
//                     const res = await sesSendEmail.run();
//                     console.log(res);
//                 } catch (error) {
// 					throw new Error("ERROR!");
//                 }
//             }

//             // console.log("hello", new Date());
//         } catch (error) {
// 			throw new Error("ERROR!");
//         }
//     },
//     {
//         timezone: "UTC",
//     }
// );
