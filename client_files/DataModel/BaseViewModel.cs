// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

namespace MobileServices.Samples.MyPictures.DataModel
{
    using System;
    using MobileServices.Samples.MyPictures.Common;
    using Windows.Foundation.Metadata;

    /// <summary>
    /// Base class for <see cref="PictureViewModel"/> and <see cref="AlbumViewModel"/> that
    /// defines properties common to both.
    /// </summary>
    [WebHostHidden]
    public abstract class BaseViewModel : BindableBase
    {
        private int uniqueId = 0;
        private string title = string.Empty;

        public BaseViewModel(int uniqueId, string title)
        {
            this.uniqueId = uniqueId;
            this.title = title;
        }

        public int UniqueId
        {
            get { return this.uniqueId; }
            set { this.SetProperty(ref this.uniqueId, value); }
        }

        public string Title
        {
            get { return this.title; }
            set { this.SetProperty(ref this.title, value); }
        }

        public override string ToString()
        {
            return this.Title;
        }
    }
}
