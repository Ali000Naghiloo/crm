var conn = new signalR.HubConnectionBuilder()
  .withUrl("https://taskmanagerapi.fanwebautomation.ir/ChatHubTaskManager", {
    //.withUrl("https://localhost:44349/ChatHubTaskManager", {
    accessTokenFactory: () => {
      // برگرداندن توکن JWT به صورت صحیح
      return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiZW1haWwiOiJ0ZXN0QHlhaG9vLmNvbSIsInVzZXJpZCI6IjBhZTE1NGZkLTUxMDktNGRkOC04MjRhLTJkMWM4MDkwOGY5MiIsIm5iZiI6MTcyMzkwMDQ4OCwiZXhwIjoxNzI2NDkyNDg4LCJpYXQiOjE3MjM5MDA0ODh9.QOprdTdsd7taMLLVMWuMua2wfi4h01yVKLCpuoAB8Ks";
    },
  })
  .build();
conn.start().catch((error) => {
  console.error(error.toString());
});
conn.on("ReceiveMessage", (message) => {});
// اینجا برای دریافت نوتیفیکیشن جدید از SignalR استفاده می‌کنیم
conn.on("ReceiveNotification1", (message) => {
  alert("نوتیفیکیشن جدید: " + message);
});
// دریافت نوتیفیکیشن از SignalR
conn.on("ReceiveNotification", (title, body, imageUrl) => {
  // نمایش نوتیفیکیشن با استفاده از API مرورگر
  if (Notification.permission === "granted") {
    var options = {
      body: body,
      icon: imageUrl || "default-icon.png",
    };
    new Notification(title, options);
  } else {
    // alert(`نوتیفیکیشن جدید: ${title} - ${body}`);
  }
});
// دریافت لیست کاربران آنلاین و بروزرسانی UI
conn.on("UpdateOnlineUsers", (onlineUsers) => {
  // چاپ لیست کاربران آنلاین در کنسول
  console.log("لیست کاربران آنلاین:");
  console.log(onlineUsers);
});
// بررسی قطع اتصال
conn.onclose((error) => {
  if (error) {
    console.error("اتصال قطع شد:", error);
  }
  // نمایش پیغام به کاربر برای رفرش صفحه
  if (confirm("اتصال به سرور قطع شده است. آیا می‌خواهید صفحه را رفرش کنید؟")) {
    window.location.reload();
  }
});
