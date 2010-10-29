using System;
using System.Collections.Generic;
using System.Text;
using SHDocVw;
using MSHTML;
using System.IO;
using Microsoft.Win32;
using System.Runtime.InteropServices;

namespace walkway
{

    [
    ComVisible(true),
    Guid("0baf978c-dc6d-11df-a441-c42c030872d9"),
    ClassInterface(ClassInterfaceType.None)
    ]
    public class BHO : IObjectWithSite
    {

        WebBrowser webBrowser;
        HTMLDocument document;



        public void OnDocumentComplete(object pDisp, ref object URL)
        {

            document = (HTMLDocument)webBrowser.Document;
            
            foreach (IHTMLInputElement tempElement in document.getElementsByTagName("INPUT"))
            {
                System.Windows.Forms.MessageBox.Show(
                    tempElement.name != null ? tempElement.name : "it sucks, no name, try id" + ((IHTMLElement)tempElement).id);
            }

        }

        public void OnBeforeNavigate2(object pDisp, ref object URL, ref object Flags, ref object TargetFrameName, ref object PostData, ref object Headers, ref bool Cancel)
        {
            document = (HTMLDocument)webBrowser.Document;

            foreach (IHTMLInputElement tempElement in document.getElementsByTagName("INPUT"))
            {
                if (tempElement.type.ToLower() == "password")
                {

                    System.Windows.Forms.MessageBox.Show(tempElement.value);
                }

            }

        }



        #region BHO Internal Functions
        public static string BHOKEYNAME = "Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Browser Helper Objects";

        [ComRegisterFunction]
        public static void RegisterBHO(Type type)
        {
            RegistryKey registryKey = Registry.LocalMachine.OpenSubKey(BHOKEYNAME, true);

            if (registryKey == null)
                registryKey = Registry.LocalMachine.CreateSubKey(BHOKEYNAME);

            string guid = type.GUID.ToString("B");
            RegistryKey bhoKey = registryKey.OpenSubKey(guid);

            if (bhoKey == null)
                bhoKey = registryKey.CreateSubKey(guid);

            registryKey.Close();
            bhoKey.Close();
        }

        [ComUnregisterFunction]
        public static void UnregisterBHO(Type type)
        {
            RegistryKey registryKey = Registry.LocalMachine.OpenSubKey(BHOKEYNAME, true);
            string guid = type.GUID.ToString("B");

            if (registryKey != null)
                registryKey.DeleteSubKey(guid, false);

        }

        public int SetSite(object site)
        {

            if (site != null)
            {
                webBrowser = (WebBrowser)site;
                webBrowser.DocumentComplete += new DWebBrowserEvents2_DocumentCompleteEventHandler(this.OnDocumentComplete);
                webBrowser.BeforeNavigate2 += new DWebBrowserEvents2_BeforeNavigate2EventHandler(this.OnBeforeNavigate2);
            }
            else
            {
                webBrowser.DocumentComplete -= new DWebBrowserEvents2_DocumentCompleteEventHandler(this.OnDocumentComplete);
                webBrowser.BeforeNavigate2 -= new DWebBrowserEvents2_BeforeNavigate2EventHandler(this.OnBeforeNavigate2);
                webBrowser = null;
            }

            return 0;

        }

        public int GetSite(ref Guid guid, out IntPtr ppvSite)
        {
            IntPtr punk = Marshal.GetIUnknownForObject(webBrowser);
            int hr = Marshal.QueryInterface(punk, ref guid, out ppvSite);
            Marshal.Release(punk);

            return hr;
        }
        #endregion
    }
}
