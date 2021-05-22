const { Client, Util, MessageEmbed } = require("discord.js");
const fsw = require("./tool/write.js");
const fsd = require("./tool/del.js");
const fsr = require("./tool/read.js");
const got = require("got");
require("dotenv").config();

const bot = new Client({
    disableMentions: "all"
});

const PREFIX = process.env.PREFIX;

bot.on("warn", console.warn);
bot.on("error", console.error);
bot.on("ready", () => console.log(`[Alice] ${bot.user.tag}`));
bot.on("ready", () =>
bot.user.setPresence({
    status: 'idle',
    activity: {
        name: '버그가 많네요!'
    }}));

bot.on("message", async (message) => {
  
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.split(" ");

    let command = message.content.toLowerCase().split(" ")[0];
    command = command.slice(PREFIX.length);

    if (command === "학교") {

      if (args[1] === "삭제") return desch();

      fsr.read(message.author.id, function(err, result) {
        if (err) return reder();
        if (String(result).replace(" ", "") === ";;") {
          lego();
        } else {
          return viep();
        }
      });

      async function lego () {
        var {body} = await got("https://open.neis.go.kr/hub/schoolInfo?Type=json&SCHUL_NM=" + args[1], {
          hooks: {
            beforeError: [
              error => {
                const {response} = error;
                if (response && response.body) {
                  const erembed = new MessageEmbed()
                  .setColor("#0x7d3640")
                  .setTitle(":triangular_flag_on_post:  **|**  **뭔가 오류가 났습니다..?**")
                  .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
                  .setFooter("AlicE by.min_G")
                  return message.channel.send(erembed);
                }
              }
            ]
          }
        });

        if (JSON.parse(body).RESULT) return ernf();

        const rep = JSON.parse(body).schoolInfo[1];
        var prs = 0;

        const oup = new MessageEmbed();
        oup.setAuthor(args[1] + " 에 대한 검색 결과", message.author.displayAvatarURL())
        oup.setColor("#0x5854b0")
        oup.setDescription("설정하실 학교의 **__번호를 적어주세요__** (번호만)")
        oup.setFooter("AlicE by.min_G")
        oup.setTimestamp()

        const prg = async function () {
          if (String(rep.row[prs]) !== "undefined") {
            oup.addField(prs + 1 + ". " + rep.row[prs].SCHUL_NM, rep.row[prs].ATPT_OFCDC_SC_NM + "\n" + rep.row[prs].ORG_RDNMA, false)
            prs++;
            prg();
          } else {
            message.channel.send(oup).then(m => m.delete({
              timeout: 15000
            }))
            try {
                var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < rep.row.length + 2, {
                    max: 1,
                    time: 15000,
                    errors: ["time"]
                });
            } catch (err) {
                const erembed = new MessageEmbed()
                .setColor("#0x7d3640")
                .setTitle(":triangular_flag_on_post:  **|**  **15초가 지나 선택이 취소되었습니다!**")
                .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
                .setFooter("AlicE by.min_G")
                return message.channel.send(erembed);
            }
            response.delete();
            const inp = parseInt(response.first().content) - 1;
            fsw.write(message.author.id, rep.row[inp].SD_SCHUL_CODE, rep.row[inp].ATPT_OFCDC_SC_CODE, rep.row[inp].SCHUL_NM);
            const seembed = new MessageEmbed()
            .setColor("#0x7d3640")
            .setTitle(":white_check_mark:  **|**  **학교가 " + rep.row[inp].SCHUL_NM + " 으로 설정되었습니다!**")
            .setDescription("이제 `!급식` 혹은 `!급식 내일`\n혹은 `!급식 YYYYMMDD` 를 통해 식단을 가져올 수 있습니다.")
            .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
            .setFooter("AlicE by.min_G")
            return message.channel.send(seembed);
          }
        }
        prg();
      }

      function ernf () {
        const efembed = new MessageEmbed()
        .setColor("#0x7d3640")
        .setTitle(":triangular_flag_on_post:  **|**  **학교를 찾지 못했습니다!**")
        .setDescription("학교 이름을 다시 한번 확인 후 시도해 주세요!\n`!학교 [학교명]`")
        .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
        .setFooter("AlicE by.min_G")
        return message.channel.send(efembed);
      }

      function desch () {
        fsd.del(message.author.id);
        const enembed = new MessageEmbed()
        .setColor("#0x7d3640")
        .setTitle(":white_check_mark: **|**  **학교 설정을 초기화했습니다!**")
        .setDescription("!학교 [학교명] 을 통해 학교를 다시 설정할 수 있습니다!")
        .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
        .setFooter("AlicE by.min_G")
        return message.channel.send(enembed);
      }

      function viep () {
        fsr.read(message.author.id, function(err, result) {
          if (err) return reder();
          const scembed = new MessageEmbed()
          .setColor("#0x7d3640")
          .setTitle(":school:  **|**  **" + String(result).split(";")[2] +"**")
          .setDescription("!학교 삭제 를 통해 학교를 다시 설정할 수 있습니다!")
          .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
          .setFooter("AlicE by.min_G")
          return message.channel.send(scembed);
        });
      }

      function reder () {
        const eriembed = new MessageEmbed()
        .setColor("#0x7d3640")
        .setTitle(":triangular_flag_on_post:  **|**  **설정값을 읽어오지 못했습니다!**")
        .setDescription("잠시 후에 다시 시도해주세요ㅠㅠ")
        .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
        .setFooter("AlicE by.min_G")
        return message.channel.send(eriembed);
      }
    }

    if (command === "급식") {
      fsr.read(message.author.id, async function(err, result) {
        if (err) return reder();
        if (String(result).replace(" ", "") === ";;") {
          const scnembed = new MessageEmbed()
          .setColor("#0x7d3640")
          .setTitle(":triangular_flag_on_post:  **|**  **학교가 설정되지 않았습니다!**")
          .setDescription("!학교 [학교명] 을 통해 학교를 먼저 설정해 주세요!")
          .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
          .setFooter("AlicE by.min_G")
          return message.channel.send(scnembed);
        } else {
          var tgdt;
          var d = new Date(), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
          if (month.length < 2) month = '0' + month;
          if (day.length < 2) day = '0' + day;
          if (args.length < 2) {
            tgdt = String(year) + String(month) + String(day);
          } else if (String(args[1]).length == 8) {
              tgdt = args[1];
            } else if (args[1] === "내일") {
              var ay = new Date(), tmonth = '' + (ay.getMonth() + 1), tday = '' + (ay.getDate() + 1), tyear = ay.getFullYear();
                if (tmonth.length < 2) tmonth = '0' + tmonth;
                if (tday.length < 2) tday = '0' + tday;
                tgdt = String(tyear) + String(tmonth) + String(tday);
            } else if (args[1] === "모레") {
              var yay = new Date(), ymonth = '' + (yay.getMonth() + 1), yday = '' + (yay.getDate() + 2), yyear = yay.getFullYear();
              if (ymonth.length < 2) ymonth = '0' + ymonth;
              if (yday.length < 2) yday = '0' + yday;
              tgdt = String(yyear) + String(ymonth) + String(yday);
            }
          const req = String(result).split(";");
          var {body} = await got("https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&ATPT_OFCDC_SC_CODE=" + req[1] + "&SD_SCHUL_CODE=" + req[0] + "&MLSV_YMD=" + tgdt, {
            hooks: {
              beforeError: [
                error => {
                  const {response} = error;
                  if (response && response.body) {
                    const erembed = new MessageEmbed()
                    .setColor("#0x7d3640")
                    .setTitle(":triangular_flag_on_post:  **|**  **뭔가 오류가 났습니다..?**")
                    .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
                    .setFooter("AlicE by.min_G")
                    return message.channel.send(erembed);
                  }
                }
              ]
            }
          });

          const rep = JSON.parse(body);
          if (rep.RESULT) return ginf();

          var luin = String(rep.mealServiceDietInfo[1].row[0].DDISH_NM).split("<br/>");
          var luou = "";
          var i;
          for (i = 0; i < luin.length; i++) {
            luou = luou + "\n" + luin[i];
          }

          if(rep.mealServiceDietInfo[1].row.length < 2) {
            const oupembed = new MessageEmbed()
            .setColor("#0x7d3640")
            .setTitle(":bookmark:  **|**  **" + String(tgdt).slice(4,6) + "월 " + String(tgdt).slice(6,8) + "일 식단표**")
            .setDescription("●**__중식__**" + luou)
            .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
            .setFooter("AlicE by.min_G")
            return message.channel.send(oupembed);
          } else {
            var diin = String(rep.mealServiceDietInfo[1].row[1].DDISH_NM).split("<br/>");
            var diou = "";
            for (i = 0; i < luin.length; i++) {
              diou = diou + "\n" + diin[i];
            }
            const oupembed = new MessageEmbed()
            .setColor("#0x7d3640")
            .setTitle(":bookmark:  **|**  **" + String(tgdt).slice(4,6) + "월 " + String(tgdt).slice(6,8) + "일 식단표**")
            .setDescription("●**__중식__**" + luou + "\n\n●**__석식__**" + diou)
            .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
            .setFooter("AlicE by.min_G")
            return message.channel.send(oupembed);
          }

          function ginf () {
            const erembed = new MessageEmbed()
            .setColor("#0x7d3640")
            .setTitle(":triangular_flag_on_post:  **|**  **식단 정보를 가져오지 못했습니다!**")
            .setDescription(req[2] + "의 " + String(tgdt).slice(4,6) + "월 " + String(tgdt).slice(6,8) + "일 식단을 찾지 못했습니다!")
            .setThumbnail('https://cdn.discordapp.com/attachments/767280811220926504/799066007095607296/alice_logo_gif.gif')
            .setFooter("AlicE by.min_G")
            return message.channel.send(erembed);
          }
        }
      });
    }
});

bot.login(process.env.BOT_TOKEN);