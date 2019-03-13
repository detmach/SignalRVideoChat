using System;
using System.Threading.Tasks;

namespace SignalRWebRct.Hubs
{
    public interface IChatHub
    {
        void Join(string username);

        void AnswerCall(bool acceptCall, string targetConnectionId);
        void CallUser(string targetConnectionId);
        void HangUp();
        
        
        void SendSignal(string signal, string targetConnectionId);
    }
}