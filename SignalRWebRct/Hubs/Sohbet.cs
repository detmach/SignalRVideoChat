using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRWebRct.Hubs
{
    public class Sohbet : Hub
    {
        private static readonly List<KeyValuePair<string, string>> OnlineKullanici = new List<KeyValuePair<string, string>>();
        public void Online(string KullaniciAdi = null)
        {
            //Kullanıcı Varmı
            if (KullaniciAdi == null)
            {
                OnlineKullanici.Remove(OnlineKullanici.Where(t => t.Key == Context.ConnectionId).FirstOrDefault());
            }
            else
            {
                var kullanici = OnlineKullanici.Where(t => t.Value == KullaniciAdi).FirstOrDefault();
                if (kullanici.Key != null)
                {
                    OnlineKullanici.Remove(kullanici);
                }

                OnlineKullanici.Add(new KeyValuePair<string, string>(Context.ConnectionId, KullaniciAdi));
            }
            Clients.All.SendAsync("Online", OnlineKullanici);
        }

        public void KanalMesaj(string mesaj)
        {
            var Kullanici = OnlineKullanici.Where(t => t.Key == Context.ConnectionId).FirstOrDefault();
            Clients.All.SendAsync("KanalMesaj", Kullanici.Value, mesaj, DateTime.Now);
        }
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Online();
            await base.OnDisconnectedAsync(exception);
        }
    }
}
